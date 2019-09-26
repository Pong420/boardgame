import { TurnOrder } from 'boardgame.io/core';
import { Schema$Phase } from '../../typings';

export const ready: Schema$Phase = {
  next: 'draw',
  allowedMoves: ['ready'],
  turnOrder: TurnOrder.ANY,
  endPhaseIf: (G, ctx) => {
    console.log(G);

    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].ready === false) {
        return false;
      }
    }

    return true;
  }
};
