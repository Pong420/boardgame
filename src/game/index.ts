import { Game } from 'boardgame.io/core';
import { setup } from './setup';
import { flow } from './flow';
import { playerView } from './playerView';
import { moves } from './moves';

export const BigTwo = Game({
  name: 'big-two',
  setup,
  flow,
  playerView,
  moves
});
