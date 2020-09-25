import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  WsException,
  WsResponse
} from '@nestjs/websockets';
import {
  CallHandler,
  CanActivate,
  ExecutionContext,
  NestInterceptor,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket } from 'socket.io';
import {
  ChatEvent,
  MessageType,
  MessageStatus,
  Schema$Message
} from '@/typings';
import {
  IdentifyDto,
  JoinChatDto,
  SendMessageDto,
  PlayerReadyDto
} from './dto';

interface Player {
  credentials: string;
  playerName: string;
}

interface Room {
  ready: string[];
  players: Record<string, Player>;
  messages: Schema$Message[];
}

interface RoomResponse<T> extends WsResponse<T> {
  room: string;
}

const store = new Map<string, Room>();
const connected = new Map<string, IdentifyDto>();

const sendMessage = (
  data: Schema$Message,
  room?: string
): WsResponse<Schema$Message> | RoomResponse<Schema$Message> => ({
  event: ChatEvent.Message,
  data,
  room
});

class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToWs().getData();
    const dto = plainToClass(IdentifyDto, data);
    const errors = await validate(dto);
    if (errors.length) {
      throw new WsException(errors);
    }

    const { matchID, playerID, credentials } = dto;

    if (store.has(matchID)) {
      const { players } = store.get(matchID);
      if (players[playerID].credentials === credentials) {
        return true;
      }
      throw new WsException('Invalid credentials');
    }
    throw new WsException('Invalid matchID');
  }
}

function removePlayer(room: Room, playerID: string): Room {
  const data = { ...room };
  delete data.players[playerID];
  data.ready = data.ready.filter(id => id !== playerID);
  return data;
}

function handleLeave(socketId: string, dto?: IdentifyDto) {
  const identify: IdentifyDto | undefined = connected.get(socketId) || dto;
  if (identify) {
    const { matchID, playerID } = identify;
    if (store.has(matchID)) {
      store.set(matchID, removePlayer(store.get(matchID), playerID));
    }
    connected.delete(socketId);
  }
}

function isRoomMessage(data: unknown): data is RoomResponse<unknown> {
  return (
    data &&
    typeof data === 'object' &&
    typeof data['event'] === 'string' &&
    typeof data['room'] === 'string'
  );
}

class MsgResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const socket: Socket = context.switchToWs().getClient();

    return next.handle().pipe(
      map(data => {
        if (isRoomMessage(data)) {
          socket.to(data.room).emit(data.event, data.data);
          return data.data;
        }
        return data;
      })
    );
  }
}

@UseInterceptors(MsgResponseInterceptor)
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @SubscribeMessage(ChatEvent.Join)
  onJoinChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { matchID, playerID, playerName, credentials }: JoinChatDto
  ) {
    socket.join(matchID);

    // Remove player from any previous game that it was a part of.
    if (connected.has(socket.id)) {
      handleLeave(socket.id);
    }

    const client: Room['players'] = { [playerID]: { playerName, credentials } };
    const joinMessage: Schema$Message = {
      playerID,
      id: String(+new Date()),
      content: playerName,
      type: MessageType.SYSTEM,
      status: MessageStatus.SUCCESS
    };

    let room: Room = {
      ready: [],
      players: client,
      messages: [joinMessage]
    };

    if (store.has(matchID)) {
      const { players, messages, ...rest } = store.get(matchID);

      const newMessages = players[playerID]
        ? messages
        : [...messages, joinMessage];

      room = {
        ...rest,
        messages: newMessages,
        players: { ...players, ...client }
      };
    }

    connected.set(socket.id, { matchID, playerID, credentials });

    store.set(matchID, room);

    return from(room.messages).pipe(map(message => sendMessage(message)));
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(ChatEvent.Send)
  onSendMessage(
    @MessageBody() { id, matchID, content, playerID }: SendMessageDto
  ) {
    const message: Schema$Message = {
      id,
      content,
      playerID,
      type: MessageType.CHAT,
      status: MessageStatus.SUCCESS
    };

    const data = store.get(matchID);
    store.set(matchID, {
      ...data,
      messages: [...data.messages, message]
    });

    return sendMessage(message, matchID);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(ChatEvent.Ready)
  onReady(@MessageBody() { matchID, playerID }: PlayerReadyDto) {
    const { players, ready, ...rest } = store.get(matchID);
    store.set(matchID, {
      ...rest,
      players,
      ready: ready.includes(playerID)
        ? ready.filter(id => id !== playerID)
        : [...ready, playerID]
    });
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(ChatEvent.Leave)
  async onLeave(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: IdentifyDto
  ) {
    handleLeave(socket.id, dto);
  }

  @SubscribeMessage('disconnect')
  async onDisconnect(@ConnectedSocket() socket: Socket) {
    handleLeave(socket.id);
  }
}
