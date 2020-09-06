import { Prefix_Game } from '../typings';
import { setup } from './setup';
import { moves } from './moves';
import { playerView } from './playerView';

export const game: Prefix_Game = {
  name: 'game-name',
  playerView,
  setup,
  moves
};
