import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  WsException,
  OnGatewayDisconnect,
  GatewayMetadata
} from '@nestjs/websockets';
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { from, merge, of, Subject, timer, race, throwError } from 'rxjs';
import {
  filter,
  map,
  takeUntil,
  mergeMap,
  delay,
  tap,
  finalize
} from 'rxjs/operators';
import { Socket } from 'socket.io';
import {
  ChatEvent,
  MessageType,
  MessageStatus,
  Schema$Message,
  Schema$ChatMessage,
  Room,
  Rooms,
  Connected,
  RoomResponse,
  WsPlayer
} from '@/typings';
import { MatchService } from '@/match/match.service';
import {
  IdentifyDto,
  JoinChatDto,
  SendMessageDto,
  PlayerReadyDto
} from './dto';
import { AuthGuard, authenticate } from './auth.guard';
import { ChatResponseInterceptor } from './chat-response.interceptor';
import {
  sendMessage,
  sendPlayer,
  createSysmMessage,
  pushMessage,
  isStarted
} from './chat.utils';
import { MemeoryStorage } from './memeory.providers';

const connect$ = new Subject<{ credentials: string }>();

const PING_TIMEOUT = 20 * 1e3;
const PING_INTERVAL = 10 * 1e3;

const options: GatewayMetadata = {
  namespace: 'chat',
  pingTimeout: PING_TIMEOUT,
  pingInterval: PING_INTERVAL
};

@UseInterceptors(ChatResponseInterceptor)
@WebSocketGateway(options)
export class ChatGateway implements OnGatewayDisconnect {
  constructor(
    @Inject(MatchService) private readonly matchService: MatchService,
    @Inject(MemeoryStorage.Rooms) private readonly rooms: Rooms,
    @Inject(MemeoryStorage.Connected) private readonly connected: Connected
  ) {}

  @SubscribeMessage(ChatEvent.Join)
  async onJoinChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: JoinChatDto
  ) {
    const { matchID, playerID, playerName, credentials } = dto;

    let room: Room = this.rooms.get(matchID);

    const match = await this.matchService.fetch(matchID, {
      state: true,
      metadata: true
    });

    // TODO: check match return
    if (!match) throw new WsException('Match not found');

    if (!room) {
      room = {
        messages: [],
        players: Array.from<null>({ length: match.state.ctx.numPlayers }).map(
          () => null
        )
      };
    }

    const idx = Number(playerID);
    const player = match.metadata.players[idx];

    if (typeof player === 'undefined') {
      throw new WsException('Invalud playerID');
    }

    if (player && player.credentials !== credentials) {
      throw new WsException('Invalid credentials');
    }

    const newPlayer = !room.players[idx];

    const joinMessage: Schema$Message = createSysmMessage({
      content: `${playerName} join the match`
    });

    if (newPlayer) {
      room.messages = pushMessage(room.messages, joinMessage);
      room.players[Number(playerID)] = {
        ready: false,
        playerID,
        playerName,
        credentials
      };

      this.rooms.set(matchID, room);
    }

    socket.join(matchID);

    this.connected.set(socket.id, { matchID, playerID, credentials });

    return merge(
      of(sendPlayer(room.players)),
      // TODO: send into array ?
      from(room.messages).pipe(
        map(message => sendMessage(message)),
        // make sure reconnect message is emiited after origin message
        finalize(() => connect$.next({ credentials }))
      ),
      newPlayer
        ? [sendPlayer(room.players, matchID), sendMessage(joinMessage, matchID)]
        : []
    );
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(ChatEvent.Send)
  onSendMessage(
    @MessageBody()
    { matchID, ...params }: SendMessageDto
  ): RoomResponse<Schema$Message> {
    const message: Schema$ChatMessage = {
      ...params,
      type: MessageType.CHAT,
      status: MessageStatus.SUCCESS
    };
    const data = this.rooms.get(matchID);
    this.rooms.set(matchID, {
      ...data,
      messages: pushMessage(data.messages, message)
    });
    return sendMessage(message, matchID);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(ChatEvent.Ready)
  onReady(
    @MessageBody() { matchID, playerID }: PlayerReadyDto
  ): RoomResponse<WsPlayer[]> {
    const room = this.rooms.get(matchID);

    if (isStarted(room)) {
      throw new WsException('Cannot change ready state after match started');
    }

    const idx = Number(playerID);
    const player = room.players[idx];
    const players = [
      ...room.players.slice(0, idx),
      { ...player, ready: !player.ready },
      ...room.players.slice(idx + 1)
    ];

    this.rooms.set(matchID, { ...room, players });

    return sendPlayer(players, matchID);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(ChatEvent.Leave)
  onLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody() identify: IdentifyDto
  ) {
    return this.handleLeave(socket, identify);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const identity = socket.handshake.query;
    const { matchID, playerID, credentials } = identity;

    const reconnected$ = connect$.pipe(
      filter(p => p.credentials === credentials)
    );

    const send = (getContent: (player: WsPlayer) => string) => {
      const room = this.rooms.get(matchID);
      const player = room.players[Number(playerID)];
      const message = createSysmMessage({ content: getContent(player) });
      room.messages = pushMessage(room.messages, message);
      this.rooms.set(matchID, room);
      return sendMessage(message, matchID);
    };

    const reconnectOrLeave$ = race([
      reconnected$.pipe(
        map(() => send(player => `${player.playerName} reconnected`))
      ),
      timer(5000).pipe(
        mergeMap(() => this.matchService.leaveMatch(identity)),
        mergeMap(() => this.handleLeave(socket, identity))
      )
    ]);

    const disconnectTimeout$ = timer(5000).pipe(
      mergeMap(() =>
        merge(
          of(send(player => `${player.playerName} disconnected`)),
          reconnectOrLeave$
        )
      )
    );

    from(authenticate(this.rooms, identity))
      .pipe(
        mergeMap(() => disconnectTimeout$),
        takeUntil(reconnected$.pipe(delay(1)))
      )
      .subscribe(
        ({ event, room, data }) => {
          socket.to(room).emit(event, data);
        },
        () => {
          // eslint-disable-next-line
          // console.log(error);
        }
      );
  }

  handleLeave(socket: Socket, identify?: IdentifyDto) {
    identify = identify || this.connected.get(socket.id);

    if (identify) {
      const { matchID, playerID } = identify;
      const room = { ...this.rooms.get(matchID) };

      if (room) {
        const idx = Number(playerID);
        const player = room.players[idx];
        const leaveMessage = createSysmMessage({
          content: `${player.playerName} leave the match`
        });

        room.players[idx] = null;
        room.messages = pushMessage(room.messages, leaveMessage);
        this.rooms.set(matchID, room);

        if (room.players.every(p => p === null)) {
          this.rooms.delete(matchID);
        }

        return merge([
          sendMessage(leaveMessage, matchID),
          sendPlayer(room.players, matchID)
        ]).pipe(tap(() => socket.leave(matchID)));
      }

      this.connected.delete(socket.id);
    }

    return throwError(`handleLeave error, identify is not defined`);
  }
}
