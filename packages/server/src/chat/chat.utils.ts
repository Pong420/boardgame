import { WsResponse } from '@nestjs/websockets';
import {
  ChatEvent,
  MessageType,
  MessageStatus,
  Schema$Message,
  Schema$SystemMessage,
  Room,
  RoomResponse
} from '@/typings';

function send<T>(event: ChatEvent, extraNamespaces?: string[]) {
  function handler(data: T): WsResponse<T>;
  function handler(data: T, room: string): RoomResponse<T>;
  function handler(data: T, room?: string) {
    return { event, data, room, extraNamespaces };
  }
  return handler;
}

export const sendMessage = send<Schema$Message>(ChatEvent.Message, []);
export const sendPlayer = send<Room['players']>(ChatEvent.Player, ['spectate']);

export function createSysmMessage(
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
export function pushMessage(
  messages: Schema$Message[],
  ...newMessages: Schema$Message[]
): Schema$Message[] {
  return [...messages, ...newMessages].slice(
    Math.max(0, messages.length - 100)
  );
}

export const isStarted = (room: Room) => room.players.every(p => p.ready);
