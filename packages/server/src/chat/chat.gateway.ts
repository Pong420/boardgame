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
import { from, merge, of, empty, Subject, timer, race } from 'rxjs';
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
  Schema$ChatMessage
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
import { Room, Rooms, Connected, RoomResponse } from './types';

const rooms: Rooms = new Map();
const connected: Connected = new Map();

const connect$ = new Subject<{ socket: Socket; credentials: string }>();

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
const sendReady = send<string[]>(ChatEvent.Ready);

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

const isStarted = (room: Room) => room.ready.length === room.players.length;

function removePlayer(room: Room, playerID: string): Room {
  const data = { ...room };
  data.players[Number(playerID)] = null;
  data.ready = data.ready.filter(id => id !== playerID);
  return data;
}

function handleLeave(socket: Socket, dto?: IdentifyDto) {
  const identify: IdentifyDto | undefined = connected.get(socket.id) || dto;
  if (identify) {
    const { matchID, playerID } = identify;
    let room = { ...rooms.get(matchID) };

    connected.delete(socket.id);

    if (room) {
      const player = room.players[Number(playerID)];
      const leaveMessage = createSysmMessage({
        content: `${player.playerName} leave the match`
      });

      room = removePlayer(rooms.get(matchID), playerID);
      room.messages = pushMessage(room.messages, leaveMessage);

      if (room.players.some(p => p !== null)) {
        rooms.set(matchID, room);

        return merge(
          of(sendMessage(leaveMessage, matchID)).pipe(
            tap(() => socket.leave(matchID))
          ),
          of(sendPlayer(room.players, matchID)),
          of(sendReady(room.ready, matchID))
        );
      } else {
        // rooms.delete(matchID);
      }
    }
  }
  // don't throw an error, leave match and disconnect may have conflict
  return empty();
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
    socket.join(matchID);

    connected.set(socket.id, { matchID, playerID, credentials });

    let room: Room = rooms.get(matchID);

    if (!room) {
      const match = await this.matchService.fetch(matchID, { state: true });
      room = {
        ready: [],
        messages: [],
        players: Array.from<null>({ length: match.state.ctx.numPlayers }).map(
          () => null
        )
      };
    }

    const player = room.players[Number(playerID)];

    if (typeof player === 'undefined') {
      throw new WsException('Invalud playerID');
    }

    if (player && player.credentials !== credentials) {
      throw new WsException('Invalid credentials');
    }

    const newPlayer = player === null;

    const joinMessage: Schema$Message = createSysmMessage({
      content: `${playerName} join the match`
    });

    if (newPlayer) {
      room.messages = pushMessage(room.messages, joinMessage);
      room.players[Number(playerID)] = {
        playerID,
        playerName,
        credentials
      };

      rooms.set(matchID, room);
    }

    connect$.next({ socket, credentials });

    return merge(
      of(sendPlayer(room.players)),
      of({ event: ChatEvent.Ready, data: room.ready }),
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
  ): RoomResponse<string[]> {
    const room = rooms.get(matchID);
    const { ready, ...rest } = room;

    if (isStarted(room)) {
      throw new WsException('Cannot change ready state after match started');
    }

    const newReadyState = ready.includes(playerID)
      ? ready.filter(id => id !== playerID)
      : [...ready, playerID];

    rooms.set(matchID, {
      ...rest,
      ready: newReadyState
    });

    return sendReady(newReadyState, matchID);
  }

  @UseGuards(new AuthGuard(rooms))
  @SubscribeMessage(ChatEvent.Leave)
  onLeave(@ConnectedSocket() socket: Socket, @MessageBody() dto: IdentifyDto) {
    return handleLeave(socket, dto);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    from(authenticate(rooms, socket.handshake.query))
      .pipe(
        mergeMap(identity => {
          const { matchID, playerID, credentials } = identity || {};
          const room = rooms.get(matchID);

          const reconnected$ = () =>
            connect$.pipe(filter(p => p.credentials === credentials));

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
                  reconnected$().pipe(
                    map(() => send(`${player.playerName} reconnected`))
                  ),
                  timer(3500).pipe(
                    mergeMap(async () => {
                      const { metadata } = await this.matchService.fetch(
                        matchID,
                        {
                          metadata: true
                        }
                      );
                      delete metadata.players[playerID].name;
                      delete metadata.players[playerID].credentials;
                      await this.matchService.setMetadata(matchID, metadata);
                    }),
                    mergeMap(() => handleLeave(socket, identity))
                  )
                ])
              )
            ),
            takeUntil(reconnected$().pipe(delay(1)))
          );
        }),
        catchError(() => handleLeave(socket))
      )
      .subscribe(({ event, room, data }) => {
        socket.to(room).emit(event, data);
      });
  }
}
