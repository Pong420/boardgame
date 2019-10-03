import { TurnOrder } from 'boardgame.io/core';
import { setup } from '../setup';
import { State, Schema$Phase } from '../../typings';

export const start: Schema$Phase<State> = {
  next: 'ready',
  allowedMoves: ['playCard', 'pass', 'sort', 'setHand'],
  turn: {
    order: TurnOrder.ALL
  },
  endPhaseIf: (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].hand.length === 0) {
        return true;
      }
    }
  },
  // @ts-ignore
  onPhaseEnd: (_, ctx) => setup(ctx)
};
