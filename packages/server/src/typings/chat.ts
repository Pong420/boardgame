import { WsResponse } from '@nestjs/websockets';

export enum ChatEvent {
  Join = 'Join',
  Message = 'Message',
  Send = 'Send',
  Ready = 'Ready',
  Leave = 'Leave',
  Player = 'Player'
}

export interface Identify {
  matchID: string;
  playerID: string;
  credentials: string;
}

export interface Param$JoinChat extends Identify {
  playerName: string;
}

export enum MessageType {
  SYSTEM,
  CHAT
}

export enum MessageStatus {
  PENDING,
  SUCCESS,
  FAILURE
}

export interface Schema$ChatMessage {
  id: string; // timestamp
  playerID: string;
  playerName: string;
  content: string;
  type: MessageType.CHAT;
  status: MessageStatus;
}

export interface Schema$SystemMessage {
  id: string; // timestamp
  content: string;
  type: MessageType.SYSTEM;
  status: MessageStatus.SUCCESS;
}

export type Schema$Message = Schema$ChatMessage | Schema$SystemMessage;

export interface Param$SendMessage extends Identify {
  id: string;
  content: string;
  playerName: string;
}

export interface Param$PlayerReady extends Identify {}

export interface WsPlayer {
  ready: boolean;
  playerID: string;
  playerName: string;
  credentials: string;
}

export interface Room {
  players: Array<WsPlayer | null>;
  messages: Schema$Message[];
}

export type Rooms = Map<string, Room>;
export type Connected = Map<string, Identify>;

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

export interface WsError {
  status: string;
  message: string;
}
