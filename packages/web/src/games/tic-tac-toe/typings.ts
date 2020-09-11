import { Game, Ctx, PhaseConfig } from 'boardgame.io';
import { BoardProps } from 'boardgame.io/react';

type Name = 'tic-tac-toe';

export interface TicTacToeMeta {
  version: string;
  name: Name;
  gameName: string;
  icon: string;
  author: string;
  numPlayers: number[];
  description?: string;
  spectate?: 'all-players' | 'single-player';
}

export type Cell = number | null;

export interface TicTacToeState {
  cells: Cell[];
  result?: string | null;
  flag: { [playerID: string]: boolean };
}

export interface TicTacToeSecret {}

export interface TicTacToePlayer {
  ready: boolean;
}

export interface TicTacToeOpponent extends Partial<TicTacToePlayer> {
  id: string;
}

export interface TicTacToeCtx extends Ctx {
  events: NonNullable<Required<Ctx['events']>>;
  random: NonNullable<Ctx['random']>;
}

export type TicTacToeGame = Game<TicTacToeState, TicTacToeCtx> & { name: Name };
export type TicTacToePlayerView = TicTacToeGame['playerView'];
export type TicTacToePhaseConfig = PhaseConfig<TicTacToeState, TicTacToeCtx>;
export type TicTacToeBoardProps = BoardProps<TicTacToeState> & {
  credentials?: string | null;
  isConnected?: boolean;
  ctx: TicTacToeCtx;
};
