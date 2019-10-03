import { ActivePlayers } from 'boardgame.io/core';
import { moves } from '../moves';
import { State, Schema$Phase } from '../../typings';

export const ready: Schema$Phase<State> = {
  start: true,
  next: 'start',
  moves: { ready: moves.ready },
  turn: {
    activePlayers: ActivePlayers.ALL
  },
  onEnd(G, ctx) {
    const poker = ctx.random
      .Shuffle(G.secret!.deck)
      .slice(0, ctx.numPlayers * 13);

    while (poker.length) {
      for (let i = 0; i < ctx.numPlayers; i++) {
        G.players[i].hand.push(poker.pop()!);
      }
    }

    return G;
  },
  endIf: (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].ready === false) {
        return false;
      }
    }
    return true;
  }
};
