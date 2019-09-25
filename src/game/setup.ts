import { deck } from '../constants';
import { Player, Secret } from '../typings';

const getInitialValue = () => ({
  ready: false,
  cards: []
});

function createPlayers(num: number) {
  const players: Record<number, Player> = {};
  for (let i = 0; i < num; i++) {
    players[i] = getInitialValue();
  }
  return players;
}

export function setup(ctx: any) {
  const secret: Secret = {
    deck
  };

  return {
    secret,
    history: {
      hand: null,
      player: ctx.currentPlayer
    },
    // ctx.numPlayers incorrect in some time
    players: createPlayers(4)
  };
}
