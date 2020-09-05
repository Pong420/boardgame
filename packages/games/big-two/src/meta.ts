import icon from './assets/big-two-icon.png';

interface Meta {
  version: string;
  name: string;
  icon: string;
  author: string;
  numberOfPlayers: string;
  description?: string;
  guide: string[];
}

export const BigTwoMeta: Meta = {
  version: __VERSION__,
  name: 'Big Two',
  icon,
  numberOfPlayers: `2 - 4 players`,
  author: 'Pong420',
  description: '',
  guide: []
};
