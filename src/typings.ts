export interface Schema$Context {
  numPlayers: number;
  turn: number;
  currentPlayer: string;
  actionPlayers: string[];
  currentPlayerMoves: number;
  playOrder: string[];
  playOrderPos: number;
  allPlayed: boolean;
  phase: string;
  prevPhase: string;
  allowedMoves: string[];
  stats: Record<
    'phase' | 'turn',
    {
      allPlayed: boolean;
      numMoves: {};
    }
  >;
  events: Schema$Events;
  random: {
    Shuffle<T>(array: T[]): T[];
  };
}

export type Schema$Move<State> = (
  G: State,
  ctx: Schema$Context,
  ...args: any[]
) => any;

export type Schema$Moves<State> = Record<string, Schema$Move<State>>;

interface SharedProps<State> {
  turnOrder?: any;
  endTurnIf?: (G: State, ctx: Schema$Context) => boolean | object;
  endGameIf?: (G: State, ctx: Schema$Context) => any;
  onTurnBegin?: (G: State, ctx: Schema$Context) => State;
  onTurnEnd?: (G: State, ctx: Schema$Context) => State;
  onMove?: (G: State, ctx: Schema$Context) => State;
}

export interface Schema$Flow<State> extends SharedProps<State> {
  phases?: {
    [key: string]: Schema$Phase<State>;
  };
}

export interface Schema$Phase<State> extends SharedProps<State> {
  allowedMoves?: string[];
  undoableMoves?: string[];
  next?: string;
  endPhaseIf?: (G: State, ctx: Schema$Context) => any;
  onPhaseBegin?: (G: State, ctx: Schema$Context) => State;
  onPhaseEnd?: (G: State, ctx: Schema$Context) => State;
}

export interface Schema$Events {
  endTurn(): void;
  endGame(): void;
  endPhase(): void;
}

export interface BoardComponentProps<State> {
  G: State;
  ctx: Schema$Context;
  events: Schema$Events;
  moves: Record<string, (...args: any[]) => void>;
  isActive: boolean;
  redo(): void;
  undo(): void;
  reset(): void;
  step?: any;
  gameID: string;
  credentials: string | null;
  playerID: string;
  isConnected: boolean;
}

export type Schema$PlayerView<State> = (
  G: State,
  ctx: Schema$Context,
  playerID: string
) => State;

export interface Params$CreateRoom<T = any> {
  name: string;
  numPlayers: number;
  setupData?: T;
}

export interface Params$JoinRoom {
  name: string;
  roomID: string;
  playerID: number;
  playerName: string;
}

export interface Params$LeaveRoom {
  name: string;
  roomID: string;
  playerID: number;
  credentials: string;
}

export interface Params$GetAllRoom {
  name: string;
}

export interface Params$GetRoom extends Params$GetAllRoom {
  roomID: string;
}

export interface Response$GetAllRoom {
  rooms: Array<{
    gameID: string;
    players: Array<{ id: number }>;
  }>;
}
