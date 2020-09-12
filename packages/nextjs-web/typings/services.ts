import { AxiosError } from 'axios';

export type ApiError = AxiosError | Error;

export interface SetupData {
  spectate?: boolean;
  matchName: string;
  description?: string;
}

export interface Match<T extends SetupData = SetupData> {
  gameName: string;
  players: Player[];
  setupData: T | null;
  gameover: null; // TODO:
  nextRoomID: string | null;
  unlisted: boolean;
  createdAt: number;
  updatedAt: number;
  matchID: string;
}

export interface Player {
  id: number;
  name: string;
}

export interface Params$GetMatches {
  name: string;
  isGameover?: boolean;
  updatedBefore?: number;
  updatedAfter?: number;
}

export interface Params$GetMatch {
  name: string;
  matchID: string;
}

export interface Params$CreateMatch<T extends SetupData = SetupData> {
  name: string;
  numPlayers: number;
  setupData?: T;
  unlisted?: boolean;
}

export interface Params$JoinMatch<T = any> {
  name: string;
  matchID: string;
  playerID: string;
  playerName: string;
  data?: T;
}

export interface Params$UpdatePlayerMeta<T extends SetupData = SetupData> {
  name: string;
  matchID: string;
  playerID: string;
  credentials: string;
  newName: string;
  data?: T;
}

export interface Params$LeaveMatch {
  name: string;
  matchID: string;
  playerID: string;
  credentials: string;
}

export interface Params$PlayAgain<T extends SetupData = SetupData> {
  name: string;
  matchID: string;
  playerID: string;
  credentials: string;
  numPlayers?: number;
  setupData?: T;
}

export interface Response$GetMatches<T extends SetupData = SetupData> {
  matches: Match<T>[];
}

export type Response$GetMatch<T extends SetupData = SetupData> = Match<T>;
