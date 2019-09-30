import { Schema$Phase } from '../../../../typings';

export const draw: Schema$Phase = {
  next: 'start',
  allowedMoves: [],
  onPhaseBegin(G, ctx) {
    const poker = ctx.random
      .Shuffle(G.secret!.deck)
      .slice(0, ctx.numPlayers * 13);

    while (poker.length) {
      for (let i = 0; i < ctx.numPlayers; i++) {
        G.players[i].hand.push(poker.pop()!);
      }
    }

    return G;
  },
  endPhaseIf: () => true
};
