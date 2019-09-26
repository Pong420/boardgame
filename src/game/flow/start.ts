import { setup } from '../setup';
import { Handler, Context } from '../../typings';

export const start = {
  next: 'ready',
  allowedMoves: ['playCard', 'pass', 'sort', 'setHand'],
  endPhaseIf: (G: Handler, ctx: Context) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].cards.length === 0) {
        return true;
      }
    }
  },
  onPhaseEnd: (_: Handler, ctx: Context) => {
    return setup(ctx);
  }
};
