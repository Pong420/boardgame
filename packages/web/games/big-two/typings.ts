import { Game, Ctx, PhaseConfig } from 'boardgame.io';
import { BoardProps } from 'boardgame.io/react';
import { moves } from './game/moves';

type Name = 'big-two';

export interface BigTwoState {
  players: Record<string, BigTwoPlayer>;
  opponents: BigTwoOpponent[];
  secret?: BigTwoSecret;
  previous: {
    hand: string[] | null;
    player: string;
  };
}

export interface BigTwoSecret {}

export interface BigTwoPlayer {
  hand: string[];
}

export interface BigTwoOpponent extends Partial<BigTwoPlayer> {
  id: string;
  numOfCards: number;
}

export type OmitArg<F> = F extends (
  G: any,
  ctx: any,
  ...args: infer P
) => infer R // eslint-disable-line @typescript-eslint/no-unused-vars
  ? (...args: P) => R
  : never;

type ExtractMove<T> = T extends (...args: any) => any
  ? T
  : T extends { move: (...args: any) => any }
  ? T['move']
  : never;

export type BigTwoMoves = {
  [K in keyof typeof moves]: OmitArg<ExtractMove<typeof moves[K]>>;
};

export type BigTwoGameOver = string | null;

export interface BigTwoCtx extends Ctx {
  events: NonNullable<Required<Ctx['events']>>;
  random: NonNullable<Ctx['random']>;
  gameover?: BigTwoGameOver;
}

export type BigTwoGame = Game<BigTwoState, BigTwoCtx> & { name: Name };
export type BigTwoPlayerView = BigTwoGame['playerView'];
export type BigTwoPhaseConfig = PhaseConfig<BigTwoState, BigTwoCtx>;
export type BigTwoBoardProps = Omit<BoardProps<BigTwoState>, 'ctx'> & {
  isConnected?: boolean;
  moves: BigTwoMoves;
  ctx: BigTwoCtx;
};
