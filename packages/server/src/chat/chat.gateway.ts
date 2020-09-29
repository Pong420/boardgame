import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  WsResponse,
  WsException,
  OnGatewayDisconnect,
  GatewayMetadata
} from '@nestjs/websockets';
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { from, merge, of, Subject, timer, race, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  takeUntil,
  mergeMap,
  delay,
  tap
} from 'rxjs/operators';
import { Socket } from 'socket.io';
import {
  ChatEvent,
  MessageType,
  MessageStatus,
  Schema$Message,
  Schema$SystemMessage,
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

const rooms: Rooms = new Map();
const connected: Connected = new Map();

const connect$ = new Subject<{ credentials: string }>();

function send<T>(event: ChatEvent) {
  function handler(data: T): WsResponse<T>;
  function handler(data: T, room: string): RoomResponse<T>;
  function handler(data: T, room?: string) {
    return { event, data, room };
  }
  return handler;
}

const sendMessage = send<Schema$Message>(ChatEvent.Message);
const sendPlayer = send<Room['players']>(ChatEvent.Player);

function createSysmMessage(
  payload: Partial<Schema$SystemMessage> & Pick<Schema$SystemMessage, 'content'>
): Schema$SystemMessage {
  return {
    id: String(+new Date()),
    type: MessageType.SYSTEM,
    status: MessageStatus.SUCCESS,
    ...payload
  };
}

// limit the maximum length of message
function pushMessage(
  messages: Schema$Message[],
  message: Schema$Message
): Schema$Message[] {
  return [...messages, message].slice(Math.max(0, messages.length - 100));
}

const isStarted = (room: Room) => room.players.every(p => p.ready);

function handleLeave(socket: Socket, identify?: IdentifyDto) {
  identify = identify || connected.get(socket.id);

  if (identify) {
    const { matchID, playerID } = identify;
    const room = { ...rooms.get(matchID) };

    if (room) {
      const idx = Number(playerID);
      const player = room.players[idx];
      const leaveMessage = createSysmMessage({
        content: `${player.playerName} leave the match`
      });

      room.players[idx] = null;
      room.messages = pushMessage(room.messages, leaveMessage);
      rooms.set(matchID, room);

      if (room.players.some(p => p !== null)) {
        return merge([
          sendMessage(leaveMessage, matchID),
          sendPlayer(room.players, matchID)
        ]).pipe(tap(() => socket.leave(matchID)));
      } else {
        rooms.delete(matchID);
      }
    }

    connected.delete(socket.id);
  }

  return throwError(`handleLeave error, identify is not defined`);
}

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
    @Inject(MatchService) private readonly matchService: MatchService
  ) {}

  @SubscribeMessage(ChatEvent.Join)
  async onJoinChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: JoinChatDto
  ) {
    const { matchID, playerID, playerName, credentials } = dto;

    let room: Room = rooms.get(matchID);

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

      rooms.set(matchID, room);
    }

    socket.join(matchID);

    connected.set(socket.id, { matchID, playerID, credentials });

    connect$.next({ credentials });

    return merge(
      of(sendPlayer(room.players)),
      // TODO: send into array ?
      from(room.messages).pipe(map(message => sendMessage(message))),
      newPlayer
        ? [sendPlayer(room.players, matchID), sendMessage(joinMessage, matchID)]
        : []
    );
  }

  @UseGuards(new AuthGuard(rooms))
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
    const data = rooms.get(matchID);
    rooms.set(matchID, {
      ...data,
      messages: pushMessage(data.messages, message)
    });
    return sendMessage(message, matchID);
  }

  @UseGuards(new AuthGuard(rooms))
  @SubscribeMessage(ChatEvent.Ready)
  onReady(
    @MessageBody() { matchID, playerID }: PlayerReadyDto
  ): RoomResponse<WsPlayer[]> {
    const room = rooms.get(matchID);

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

    rooms.set(matchID, { ...room, players });

    return sendPlayer(players, matchID);
  }

  @UseGuards(new AuthGuard(rooms))
  @SubscribeMessage(ChatEvent.Leave)
  onLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody() identify: IdentifyDto
  ) {
    return handleLeave(socket, identify);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    from(authenticate(rooms, socket.handshake.query))
      .pipe(
        mergeMap(identity => {
          const { matchID, playerID, credentials } = identity || {};
          const room = rooms.get(matchID);

          const reconnected$ = connect$.pipe(
            filter(p => p.credentials === credentials)
          );

          const player = room.players[Number(playerID)];

          const send = (content: string) => {
            const message = createSysmMessage({ content });
            room.messages = pushMessage(room.messages, message);
            rooms.set(matchID, room);
            return sendMessage(message, matchID);
          };

          return timer(2500).pipe(
            mergeMap(() =>
              merge(
                of(send(`${player.playerName} disconnected`)),
                race([
                  reconnected$.pipe(
                    map(() => send(`${player.playerName} reconnected`))
                  ),
                  timer(3500).pipe(
                    mergeMap(() => {
                      return this.matchService.leaveMatch(identity);
                    }),
                    mergeMap(() => {
                      return handleLeave(socket, identity);
                    })
                  )
                ])
              )
            ),
            takeUntil(reconnected$.pipe(delay(1)))
          );
        }),
        catchError(() => {
          return handleLeave(socket);
        })
      )
      .subscribe(
        ({ event, room, data }) => {
          socket.to(room).emit(event, data);
        },
        error => {
          // eslint-disable-next-line
          console.log(error);
        }
      );
  }
}
