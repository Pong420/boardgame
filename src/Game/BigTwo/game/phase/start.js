import setup from '../setup';

export default {
  next: 'ready',
  allowedMoves: ['playCard', 'pass', 'sort', 'setHand'],
  endPhaseIf: (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].cards.length === 0) {
        return true;
      }
    }
  },
  onPhaseEnd: (_, ctx) => {
    return setup(ctx);
  }
};
