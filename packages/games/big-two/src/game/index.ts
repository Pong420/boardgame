import { setup } from './setup';
import { phases } from './phases';
import { playerView } from './playerView';
import { moves } from './moves';
import { BigTwoGame } from '../typings';

export const game: BigTwoGame = {
  name: 'big-two',
  phases,
  moves,
  setup,
  playerView
};
