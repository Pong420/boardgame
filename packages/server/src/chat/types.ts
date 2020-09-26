import { WsResponse } from '@nestjs/websockets';
import { Schema$Message, WS$Player } from '@/typings';
import { IdentifyDto } from './dto';

export interface Room {
  ready: string[];
  players: Array<WS$Player | null>;
  messages: Schema$Message[];
}

export type Rooms = Map<string, Room>;
export type Connected = Map<string, IdentifyDto>;

export interface RoomResponse<T = unknown> extends WsResponse<T> {
  room: string;
}

export function isRoomMessage(data: unknown): data is RoomResponse<unknown> {
  return (
    data &&
    typeof data === 'object' &&
    typeof data['event'] === 'string' &&
    typeof data['room'] === 'string'
  );
}
