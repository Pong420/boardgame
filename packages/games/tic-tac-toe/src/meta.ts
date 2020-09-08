import { TicTacToeMeta } from './typings';
import icon from './tic-tac-toe.svg';

export const meta: TicTacToeMeta = {
  version: __VERSION__,
  name: 'tic-tac-toe',
  gameName: 'Tic-Tac-Toe',
  icon,
  numPlayers: [2],
  author: 'boardgame.io',
  description: '',
  spectate: true
};
