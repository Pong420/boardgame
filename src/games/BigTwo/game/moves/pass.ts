import { INVALID_MOVE } from 'boardgame.io/core';
import { Schema$Move } from '../../../../typings';

export const pass: Schema$Move = (G, ctx) => {
  if (ctx.currentPlayer === G.previous.player) {
    return INVALID_MOVE;
  }

  ctx.events.endTurn();
};
