interface Meta {
  version: string;
  name: string;
  icon: string;
  author: string;
  numOfPlayers: number[];
  description?: string;
  guide: string[];
}

const Prefix_Meta: Meta = {
  version: __VERSION__,
  name: 'Game Name',
  icon: '',
  numOfPlayers: [],
  author: '',
  description: '',
  guide: []
};

export default Prefix_Meta;
