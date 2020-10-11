import { Game, Ctx, PhaseConfig } from 'boardgame.io';
import { BoardProps } from 'boardgame.io/react';
import { Gameover } from '@/typings';

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
}

export interface TicTacToeGameOver extends Gameover {}

export interface TicTacToeCtx extends Ctx {
  events: NonNullable<Required<Ctx['events']>>;
  random: NonNullable<Ctx['random']>;
  gameover: TicTacToeGameOver;
}

export type TicTacToeGame = Game<TicTacToeState, TicTacToeCtx> & { name: Name };
export type TicTacToePlayerView = TicTacToeGame['playerView'];
export type TicTacToePhaseConfig = PhaseConfig<TicTacToeState, TicTacToeCtx>;
export type TicTacToeBoardProps = Omit<BoardProps<TicTacToeState>, 'ctx'> & {
  credentials?: string | null;
  isConnected?: boolean;
  ctx: TicTacToeCtx;
};
