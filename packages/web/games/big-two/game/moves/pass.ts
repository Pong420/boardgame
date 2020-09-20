import { INVALID_MOVE } from 'boardgame.io/core';
import { BigTwoState, BigTwoCtx } from '../../typings';

export const pass = (
  G: BigTwoState,
  ctx: BigTwoCtx,
  _unknown?: string | number // avoid to use this syntax <div onClick={moves.pass} />
) => {
  if (ctx.currentPlayer === G.previous.player) {
    return INVALID_MOVE;
  }

  ctx.events.endTurn();
};
