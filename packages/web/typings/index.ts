import { ReactNode } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

// nestjs error format
interface ApiErrorValue {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ApiError extends Omit<AxiosError, 'response'> {
  response?: AxiosResponse<ApiErrorValue | string>;
}

export interface GameMeta {
  name: string;
  gameName: string;
  icon: ReactNode;
  author: string;
  numPlayers: number[];
  description?: string;
  spectate?: 'all-players' | 'single-player';
  bot?: boolean;
}

// To use bots in boardgame.io/ai, `ctx.gameover` must be this format
export interface Gameover {
  score?: number;
  draw?: boolean;
  winner?: string; // playerID
}

export type {
  Player,
  SetupData,
  Param$GetMatches,
  Param$GetMatch,
  Param$CreateMatch,
  Param$JoinMatch,
  Param$LeaveMatch,
  Param$PlayAgain,
  Schema$Match,
  Response$GetMatches,
  Response$GetMatch,
  Response$JoinMatch,
  Response$CreateMatch,
  Response$PlayAgain,
  // --- chat ---
  Identify,
  Schema$Message,
  Schema$ChatMessage,
  Schema$SystemMessage,
  Param$JoinChat,
  Param$SendMessage,
  Param$PlayerReady,
  Response$Spectate,
  WsPlayer,
  WsError
} from '@boardgame/server';

export {
  ChatEvent,
  MessageType,
  MessageStatus
} from '@boardgame/server/dist/typings';
