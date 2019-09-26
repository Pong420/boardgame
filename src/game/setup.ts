import { deck } from '../constants';
import { Player, Secret, Schema$Context } from '../typings';

const createPlayer = (): Player => ({
  ready: false,
  hand: []
});

function createPlayers(num: number) {
  const players: Record<string, Player> = {};
  for (let i = 0; i < num; i++) {
    players[i] = createPlayer();
  }
  return players;
}

export function setup(ctx: Schema$Context) {
  const secret: Secret = {
    deck
  };

  return {
    secret,
    history: {
      hand: null,
      player: ctx.currentPlayer
    },
    players: createPlayers(4)
  };
}
