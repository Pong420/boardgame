import { ReactNode } from 'react';
import { AxiosError } from 'axios';

export type ApiError = AxiosError | Error;

export interface GameMeta {
  name: string;
  gameName: string;
  icon: ReactNode;
  author: string;
  numPlayers: number[];
  description?: string;
  spectate?: 'all-players' | 'single-player';
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
  ChatEvent,
  Schema$Message,
  Param$JoinChat
} from '@boardgame/server';
