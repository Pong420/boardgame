import icon from './assets/big-two-icon.png';

interface Meta {
  version: string;
  name: string;
  icon: string;
  author: string;
  numOfPlayers: string;
  description?: string;
  guide: string[];
}

const BigTowMeta: Meta = {
  version: __VERSION__,
  name: 'Big Two',
  icon,
  numOfPlayers: `2 - 4 players`,
  author: 'Pong420',
  description: '',
  guide: []
};

export default BigTowMeta;
