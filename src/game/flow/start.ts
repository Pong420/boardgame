import { setup } from '../setup';
import { Schema$Phase } from '../../typings';

export const start: Schema$Phase = {
  next: 'ready',
  allowedMoves: ['playCard', 'pass', 'sort', 'setHand'],
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
