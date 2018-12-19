import { INVALID_MOVE } from 'boardgame.io/core';

export default function pass(G, ctx) {
  if (ctx.currentPlayer === G.history.player) {
    console.log('You cannot pass');
    return INVALID_MOVE;
  }
  ctx.events.endTurn();
}
