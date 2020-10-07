import { setup } from './setup';
import { playerView } from './playerView';
import { Prefix_Game, Prefix_Gameover } from '../typings';

export const game: Prefix_Game = {
  name: 'game-name',
  playerView,
  setup,
  endIf: (): Prefix_Gameover | undefined => {
    return undefined;
  }
};
