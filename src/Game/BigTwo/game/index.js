import { Game } from 'boardgame.io/core';

import setup from './setup';
import flow from './flow';
import moves from './moves.js';
import playerView from './playerView';

export default Game({
  name: 'big-two',
  setup,
  playerView,
  moves,
  flow
});
