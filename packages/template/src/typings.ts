import { Game, Ctx, PhaseConfig } from 'boardgame.io';
import { BoardProps } from 'boardgame.io/react';
import { moves } from './game/moves';

export type OmitArg<F> = F extends (
  G: any,
  ctx: any,
  ...args: infer P
) => infer R // eslint-disable-line @typescript-eslint/no-unused-vars
  ? (...args: P) => R
  : never;

type Name = 'game-name';

export interface Prefix_Meta {
  version: string;
  name: Name;
  gameName: string;
  icon: string;
  author: string;
  numPlayers: [];
  description?: string;
}

export interface Prefix_State {
  players: Record<string, Prefix_Player>;
  opponents: Prefix_Opponent[];
  secret?: Prefix_Secret;
}

export interface Prefix_Secret {}

export interface Prefix_Player {
  ready: boolean;
}

export interface Prefix_Opponent extends Partial<Prefix_Player> {
  id: string;
}

export type Prefix_Moves = {
  [K in keyof typeof moves]: OmitArg<typeof moves[K]>;
};

export interface Prefix_Ctx extends Ctx {
  events: NonNullable<Required<Ctx['events']>>;
  random: NonNullable<Ctx['random']>;
}

export type Prefix_Game = Game<Prefix_State, Prefix_Ctx> & { name: Name };
export type Prefix_PlayerView = Prefix_Game['playerView'];
export type Prefix_PhaseConfig = PhaseConfig<Prefix_State, Prefix_Ctx>;
export type Prefix_BoardProps = BoardProps<Prefix_State> & {
  isConnected?: boolean;
  moves: Prefix_Moves;
  ctx: Prefix_Ctx;
};
