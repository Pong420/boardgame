import { Game, Ctx, PhaseConfig } from 'boardgame.io';
import { BoardProps } from 'boardgame.io/react';
import { moves } from './game/moves';

export type OmitArg<F> = F extends (
  G: any,
  ctx: any,
  ...args: infer P
) => infer R
  ? (...args: P) => R
  : never;

export interface BigTwoState {
  players: Record<string, BigTwoPlayer>;
  opponents: Opponent[];
  secret?: BigTwoSecret;
  previous: {
    hand: string[] | null;
    player: string;
  };
}

export interface BigTwoSecret {
  deck: string[];
}

export interface BigTwoPlayer {
  ready: boolean;
  hand: string[];
}

export interface Opponent extends Partial<BigTwoPlayer> {
  id: number;
  numOfCards: number;
}

export type BigTwoMoves = {
  [K in keyof typeof moves]: OmitArg<typeof moves[K]>;
};

export interface BigTwoCtx extends Ctx {
  events: NonNullable<Required<Ctx['events']>>;
  random: NonNullable<Ctx['random']>;
}

export type BigTwoGame = Game<BigTwoState, BigTwoCtx>;
export type BigTwoPlayerView = BigTwoGame['playerView'];
export type BigTwoPhaseConfig = PhaseConfig<BigTwoState, BigTwoCtx>;
export type BigTwoBoardProps = BoardProps<BigTwoState> & {
  isConnected?: boolean;
  moves: BigTwoMoves;
  ctx: BigTwoCtx;
};
