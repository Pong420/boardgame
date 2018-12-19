import { TurnOrder } from 'boardgame.io/core';

export default {
  next: 'draw',
  allowedMoves: ['ready'],
  turnOrder: TurnOrder.ANY,
  endPhaseIf: (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].ready === false) {
        return false;
      }
    }

    return true;
  }
};
