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
  version: __VERSION__,
  name: 'Game Name',
  icon: '',
  numberOfPlayers: [],
  author: '',
  description: '',
  guide: []
};
