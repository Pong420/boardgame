import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  WsResponse,
  WsException
} from '@nestjs/websockets';
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable, from, merge, of, empty } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Socket } from 'socket.io';
import {
  ChatEvent,
  MessageType,
  MessageStatus,
  Schema$Message,
  WSResponse$Player
} from '@/typings';
import { MatchService } from '@/match/match.service';
import {
  IdentifyDto,
  JoinChatDto,
  SendMessageDto,
  PlayerReadyDto
} from './dto';
import { AuthGuard } from './auth.guard';
import { ChatResponseInterceptor } from './chat-response.interceptor';
import { Room, Rooms, Connected, RoomResponse } from './types';

const rooms: Rooms = new Map();
const connected: Connected = new Map();

function send<T>(event: ChatEvent) {
  function handler(data: T): WsResponse<T>;
  function handler(data: T, room: string): RoomResponse<T>;
  function handler(data: T, room?: string) {
    return { event, data, room };
  }
  return handler;
}

const sendMessage = send<Schema$Message>(ChatEvent.Message);
const sendPlayer = send<WSResponse$Player>(ChatEvent.Player);
const sendReady = send<string[]>(ChatEvent.Ready);

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
      const leaveMessage: Schema$Message = {
        ...identify,
        id: String(+new Date()),
        content: `${player.playerName} leave the match`,
        type: MessageType.SYSTEM,
        status: MessageStatus.SUCCESS
      };

      if (!isStarted(room)) {
        room = removePlayer(rooms.get(matchID), playerID);
      }
      room.messages = pushMessage(room.messages, leaveMessage);

      rooms.set(matchID, room);

      return of(sendMessage(leaveMessage, matchID)).pipe(
        tap(() => socket.leave(matchID))
      );
    }
  }
}

@UseInterceptors(ChatResponseInterceptor)
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
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

    const joinMessage: Schema$Message = {
      playerID,
      id: String(+new Date()),
      content: `${playerName} join the match`,
      type: MessageType.SYSTEM,
      status: MessageStatus.SUCCESS
    };

    if (newPlayer) {
      room.messages = pushMessage(room.messages, joinMessage);
      room.players[Number(playerID)] = {
        playerName,
        credentials
      };

      rooms.set(matchID, room);
    }

    // player event should send before message
    return merge(
      of({ event: ChatEvent.Ready, data: room.ready }),
      from(room.players).pipe(
        map((player, idx) => {
          if (player) {
            const { credentials, ...payload } = player;
            return sendPlayer({ playerID: String(idx), ...payload });
          }
          return empty();
        })
      ),
      newPlayer
        ? [
            sendPlayer({ playerID, playerName }, matchID),
            sendMessage(joinMessage, matchID)
          ]
        : [],
      from(room.messages).pipe(map(message => sendMessage(message)))
    );
  }

  @UseGuards(new AuthGuard(rooms))
  @SubscribeMessage(ChatEvent.Send)
  onSendMessage(
    @MessageBody() { id, matchID, content, playerID }: SendMessageDto
  ): RoomResponse<Schema$Message> {
    const message: Schema$Message = {
      id,
      content,
      playerID,
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
  onLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: IdentifyDto
  ): Observable<RoomResponse<Schema$Message>> {
    return handleLeave(socket, dto);
  }
}
