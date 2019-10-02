import { INVALID_MOVE } from 'boardgame.io/core';
import { State, Schema$Move } from '../../typings';

export const pass: Schema$Move<State> = (G, ctx) => {
  if (ctx.currentPlayer === G.previous.player) {
    return INVALID_MOVE;
  }

  ctx.events.endTurn();
};
