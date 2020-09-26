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

export interface Schema$Message {
  id: string; // timestamp
  playerID: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
}

export interface Param$SendMessage extends Identify {
  id: string;
  content: string;
}

export interface Param$PlayerReady extends Identify {}

export interface WS$Player {
  credentials: string;
  playerName: string;
}

export interface WSResponse$Player extends Omit<WS$Player, 'credentials'> {
  playerID: string;
}
