import { ready } from './ready';
import { setHand } from './setHand';
import { pass } from './pass';
import { playCard } from './playCard';

export const moves = {
  ready,
  setHand,
  pass,
  playCard
};

export type BigTwoMoves = typeof moves;
