export enum ChatEvent {
  Join = 'Join',
  Message = 'Message',
  Send = 'Send',
  Ready = 'Ready',
  Leave = 'Leave'
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

export interface Schema$Message {
  id: number; // timestamp,
  playerID: string;
  content: string;
  type: MessageType;
}

export interface Param$SendMessage extends Identify {
  content: string;
}

export interface Param$PlayerReady extends Identify {}
