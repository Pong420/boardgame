export interface SetupData {
  allowSpectate?: boolean;
  matchName: string;
  description?: string;
}

export interface Player {
  id: number;
  name?: string;
}

export interface Schema$Match<T extends SetupData = SetupData> {
  gameName: string;
  players: Player[];
  setupData: T | null;
  gameover?: unknown;
  nextMatchID?: string;
  unlisted: boolean;
  createdAt: number;
  updatedAt: number;
  matchID: string;
}

export interface Param$GetMatches {
  name: string;
  isGameover?: boolean;
  updatedBefore?: number;
  updatedAfter?: number;
}

export interface Param$GetMatch {
  name: string;
  matchID: string;
}

export interface Param$CreateMatch<T extends SetupData = SetupData> {
  name: string;
  numPlayers: number;
  setupData?: T;
  unlisted?: boolean;
}

export interface Param$JoinMatch<T = any> {
  name: string;
  matchID: string;
  playerID: string;
  playerName: string;
  data?: T;
}

export interface Param$UpdatePlayerMeta<T extends SetupData = SetupData> {
  name: string;
  matchID: string;
  playerID: string;
  credentials: string;
  newName: string;
  data?: T;
}

export interface Param$LeaveMatch {
  name: string;
  matchID: string;
  playerID: string;
  credentials: string;
}

export interface Param$PlayAgain<T extends SetupData = SetupData> {
  name: string;
  matchID: string;
  playerID: string;
  credentials: string;
  numPlayers?: number;
  setupData?: T;
}

export interface Response$GetMatches<T extends SetupData = SetupData> {
  matches: Schema$Match<T>[];
}

export type Response$GetMatch<T extends SetupData = SetupData> = Schema$Match<
  T
>;

export interface Response$CreateMatch {
  matchID: string;
}

export interface Response$JoinMatch {
  playerCredentials: string;
}

export interface Response$PlayAgain {
  nextMatchID: string;
}
