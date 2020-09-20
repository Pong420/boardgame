import { ActivePlayers } from 'boardgame.io/core';
import { moves } from '../moves';
import { BigTwoPhaseConfig } from '../../typings';

export const ready: BigTwoPhaseConfig = {
  start: true,
  next: 'start',
  moves: { ready: moves.ready },
  turn: {
    activePlayers: ActivePlayers.ALL
  },
  onEnd(G, ctx) {
    if (G.secret) {
      const deck = ctx.random
        .Shuffle(G.secret.deck)
        .slice(0, ctx.numPlayers * 13);

      while (deck?.length) {
        for (let i = 0; i < ctx.numPlayers; i++) {
          const next = deck.pop();
          if (next) {
            G.players[i].hand.push(next);
          }
        }
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
