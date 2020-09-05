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

export const Prefix_Meta: Meta = {
  version: pkg.version,
  name: 'Game Name',
  icon: '',
  numberOfPlayers: [],
  author: '',
  description: '',
  guide: []
};
