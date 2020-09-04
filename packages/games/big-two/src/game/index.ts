import { setup } from './setup';
import { phases } from './phases';
import { playerView } from './playerView';
import { moves } from './moves';
import { BigTwoGame } from '../typings';

export const BigTwoName = 'big-two';

export const BigTwo: BigTwoGame = {
  name: BigTwoName,
  phases,
  moves,
  setup,
  playerView
};
