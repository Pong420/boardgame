type Action<State, R = State> = (G: State, ctx: Schema$Context) => R;

export interface Schema$Game<State> {
  name: string;
  setup: (ctx: Schema$Context, setUpData: any) => State;
  moves?: Schema$Moves<State>;
  seed?: string;
  turn?: Schema$Turn<State>;
  endIf?: Action<State, any>;
}

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

export interface Schema$Turn<State> {
  order?: any;
  onBegin?: Action<State>;
  onEnd?: Action<State>;
  endIf?: Action<State, any>;
  onMove?: Action<State>;
  moveLimit?: number;
  activePlayers?: any;
  stages?: Schema$Stage<State>;
}

export type Schema$MoveFn<State> = (
  G: State,
  ctx: Schema$Context,
  ...args: any[]
) => any;

export type Schema$Move<State> =
  | Schema$MoveFn<State>
  | {
      move: Schema$MoveFn<State>;
      undoable: boolean;
      redact: boolean;
    };

export type Schema$Moves<State> = Record<string, Schema$Move<State>>;

export interface Schema$Phase<State> {
  start?: boolean;
  next?: string;
  onBegin?: Action<State>;
  onEnd?: Action<State>;
  endIf?: Action<State, any>;
  moves?: Schema$Moves<State>;
  turn?: Schema$Turn<State>;
}

export interface Schema$Stage<State> {
  moves?: Schema$Moves<State>;
  next?: string;
}

export interface Schema$Events {
  endTurn(): void;
  endPhase(): void;
  endGame(): void;
  endPhase(): void;
  endStage(): void;
  setPhase(phases: string): void;
  setStage(stages: string): void;
  setActivePlayers(
    options?:
      | {
          player?: string;
          others?: string;
          all?: string;
          value?: Record<string, string>;
          moveLimit?: number;
          revert?: boolean;
          next?: any;
        }
      | string[]
  ): void;
}

export interface BoardComponentProps<State> {
  G: State;
  ctx: Schema$Context;
  events: Schema$Events;
  moves: Record<string, (...args: any[]) => void>;
  redo(): void;
  undo(): void;
  reset(): void;
  step?: any;
  log: any;
  gameID: string;
  playerID: string;
  gameMetadata: any;
  isActive: boolean;
  isConnected: boolean;
  isMultiplayer: boolean;
  credentials: string | null;
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

export interface Params$GetGame {
  name: string;
  gameID: string;
}

export interface Params$GetAllRoom {
  name: string;
}

export interface Params$GetRoom extends Params$GetAllRoom {
  roomID: string;
}

export interface Response$GetGame {
  roomID: string;
  players: Array<{ id: number }>;
}

export interface Response$GetAllRoom {
  rooms: Array<{
    gameID: string;
    players: Array<{ id: number }>;
  }>;
}
