import { INVALID_MOVE } from 'boardgame.io/core';
import { Hand } from 'pokersolver';
import { BigTwoState, BigTwoCtx } from '../../typings';

export const playCard = (G: BigTwoState, ctx: BigTwoCtx, hand: string[]) => {
  if (Array.isArray(hand) && hand.length) {
    const newHand = Hand.solve(hand, 'bigtwo');
    const isSamePlayer = G.previous.player === ctx.currentPlayer;

    let win = true;
    let sameLength = true;

    if (newHand.isPossible) {
      if (!isSamePlayer) {
        const lastHand = Hand.solve(G.previous.hand, 'bigtwo');
        win = newHand === Hand.winners([newHand, lastHand])[0];
        sameLength = hand.length === lastHand.cards.length;
      }

      if (win && sameLength) {
        const deck = G.players[ctx.currentPlayer].hand;
        if (hand.every(p => deck.includes(p))) {
          G.players[ctx.currentPlayer].hand = deck.filter(
            card => !hand.includes(card)
          );

          G.previous.hand = hand;
          G.previous.player = ctx.currentPlayer;
          ctx.events.endTurn();
        }

        return;
      }

      switch (false) {
        case win:
          // eslint-disable-next-line
          console.log('This hand lose to last hand');
          break;
        case sameLength:
          // eslint-disable-next-line
          console.log('Length of hand is not same');
          break;
        default:
      }
    } else {
      // eslint-disable-next-line
      console.log('This hand cannot be solved', hand);
    }
  }

  return INVALID_MOVE;
};
