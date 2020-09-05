import pkg from '../package.json';

interface Meta {
  version: string;
  name: string;
  icon: string;
  author: string;
  numberOfPlayers: number[];
  description?: string;
  guide: string[];
}

export const BigTwoMeta: Meta = {
  version: pkg.version,
  name: 'Big Two',
  icon: require('./assets/big-two-icon.png'),
  numberOfPlayers: [2, 4],
  author: 'Pong420',
  description: '',
  guide: []
};
