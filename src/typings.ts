export interface State {
  players: Record<number, Player>;
  opponents: Opponent[];
  secret?: Secret;
}

export interface Secret {
  deck: string[];
}

export interface Player {
  ready: boolean;
  hand: string[];
}

export interface Opponent extends Omit<Player, 'hand'> {
  id: number;
  numOfCards: number;
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

export type Schema$Move = (G: State, ctx: Schema$Context, ...args: any[]) => any;

export type Schema$Moves = Record<string, Schema$Move>;

interface SharedProps {
  turnOrder?: any;
  endTurnIf?: (G: State, ctx: Schema$Context) => boolean | object;
  endGameIf?: (G: State, ctx: Schema$Context) => any;
  onTurnBegin?: (G: State, ctx: Schema$Context) => State;
  onTurnEnd?: (G: State, ctx: Schema$Context) => State;
  onMove?: (G: State, ctx: Schema$Context) => State;
}

export interface Schema$Flow extends SharedProps {
  phases?: {
    [key: string]: Schema$Phase;
  };
}

export interface Schema$Phase extends SharedProps {
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

export interface BoardComponentProps {
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

export type Schema$PlayerView = (G: State, ctx: Schema$Context, playerID: string) => State;
