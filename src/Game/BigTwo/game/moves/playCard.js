import { INVALID_MOVE } from 'boardgame.io/core';
import { Hand } from 'pokersolver';
import pullAll from 'lodash/pullAll';

export default function(G, ctx, playerCards, combination) {
  if (Array.isArray(combination) && combination.length && G.secret) {
    const newHand = Hand.solve(combination, 'bigtwo');
    const NeedToCheck = G.history.player !== ctx.currentPlayer;

    let win = true;
    let sameLength = true;

    const cards = newHand.toArray(true);
    const playerCardsRemain = pullAll(playerCards.slice(), cards);

    if (newHand.isPossible) {
      if (NeedToCheck) {
        const lastHand = Hand.solve(G.history.hand, 'bigtwo');
        win = newHand === Hand.winners([newHand, lastHand])[0];
        sameLength = cards.length === lastHand.cards.length;
      }

      if (win && sameLength) {
        G.players[ctx.currentPlayer].cards = playerCardsRemain;
        G.history.hand = cards;
        G.history.player = ctx.currentPlayer;

        ctx.events.endTurn();

        return G;
      }

      switch (false) {
        case win:
          console.log('This hand lose to then last hand');
          break;
        case sameLength:
          console.log('Length of hand is not same');
          break;
        default:
      }
    } else {
      console.log('Tthis hand cannot be solved', cards);
    }
  }

  return INVALID_MOVE;
}
