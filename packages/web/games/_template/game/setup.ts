import { Ctx } from 'boardgame.io';
import { Prefix_Player, Prefix_Secret, Prefix_State } from '../typings';

const createPlayer = (): Prefix_Player => ({ ready: false });

function createPlayers(num: number) {
  const players: Record<string, Prefix_Player> = {};
  for (let i = 0; i < num; i++) {
    players[i] = createPlayer();
  }
  return players;
}

export function setup(ctx: Ctx): Prefix_State {
  const secret: Prefix_Secret = {};

  return {
    secret,
    opponents: [],
    players: createPlayers(ctx.numPlayers)
  };
}
