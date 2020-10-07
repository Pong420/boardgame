import { BigTwoPlayer, BigTwoState, BigTwoCtx } from '../typings';
import { deck } from '../utils/deck';

const createPlayer = (): BigTwoPlayer => ({
  hand: []
});

function createPlayers(num: number) {
  const players: Record<string, BigTwoPlayer> = {};
  for (let i = 0; i < num; i++) {
    players[i] = createPlayer();
  }
  return players;
}

export function setup(ctx: BigTwoCtx, _setupData?: unknown): BigTwoState {
  const { numPlayers } = ctx;
  const players = createPlayers(numPlayers);
  const shuffled = ctx.random.Shuffle(deck).slice(0, numPlayers * 13);

  for (let i = 0; i < shuffled.length; i++) {
    const player = players[i % numPlayers];
    player.hand.push(shuffled[i]);
  }

  return {
    previous: {
      hand: null,
      player: ctx.currentPlayer
    },
    opponents: [],
    players
  };
}
