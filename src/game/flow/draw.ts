import { Handler, Context } from '../../typings';

export const draw = {
  allowedMoves: [],
  onPhaseBegin(G: Handler, ctx: Context) {
    const poker = ctx.random.Shuffle(G.secret!.deck).slice(0, ctx.numPlayers * 13);

    while (poker.length) {
      for (let i = 0; i < ctx.numPlayers; i++) {
        G.players[i].cards.push(poker.pop());
      }
    }

    return G;
  },
  endPhaseIf: () => true
};
