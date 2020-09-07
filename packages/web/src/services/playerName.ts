import { validators } from '../utils/form';
import { createLocalStorage } from '../utils/storage';

export const PlayerName = createLocalStorage('BOARDGAME_PLAYER_NAME', '');

export const PlayerNameValidators = [
  validators.required('Please input your name'),
  validators.maxLength(10, 'Name cannot longer than 10')
];
