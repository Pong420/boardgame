import { Ctx } from 'boardgame.io';
import { deck } from '../utils/deck';
import { BigTwoPlayer, BigTwoSecret, BigTwoState } from '../typings';

const createPlayer = (): BigTwoPlayer => ({
  ready: false,
  hand: []
});

function createPlayers(num: number) {
  const players: Record<string, BigTwoPlayer> = {};
  for (let i = 0; i < num; i++) {
    players[i] = createPlayer();
  }
  return players;
}

export function setup(ctx: Ctx, _setupData?: unknown): BigTwoState {
  const secret: BigTwoSecret = {
    deck
  };

  return {
    secret,
    previous: {
      hand: null,
      player: ctx.currentPlayer
    },
    opponents: [],
    players: createPlayers(ctx.numPlayers)
  };
}
