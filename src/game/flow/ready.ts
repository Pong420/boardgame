import { TurnOrder } from 'boardgame.io/core';
import { Handler, Context } from '../../typings';

export const ready = {
  next: 'draw',
  allowedMoves: ['ready'],
  turnOrder: TurnOrder.ANY,
  endPhaseIf: (G: Handler, ctx: Context) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].ready === false) {
        return false;
      }
    }

    return true;
  }
};
