import { Prefix_Game } from '../typings';
import { setup } from './setup';
import { moves } from './moves';
import { playerView } from './playerView';

export const Prefix_Name = 'game-name';

export const Prefix_: Prefix_Game = {
  name: Prefix_Name,
  playerView,
  setup,
  moves
};
