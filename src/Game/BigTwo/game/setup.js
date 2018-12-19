import poker from './helper/poker';
import createPlayers from './helper/player.js';

export default function setup(ctx) {
  return {
    secret: {
      poker
    },
    history: {
      hand: null,
      player: ctx.currentPlayer
    },
    // ctx.numPlayers incorrect in some time
    players: createPlayers(4)
  };
}
