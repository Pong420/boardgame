import { INVALID_MOVE } from 'boardgame.io/core';
import { Hand } from 'pokersolver';
import { Schema$Move } from '../../../../typings';
import pullAll from 'lodash/pullAll';

export const playCard: Schema$Move = (
  G,
  ctx,
  playerCards: string[],
  combination: string[]
) => {
  if (Array.isArray(combination) && combination.length && G.secret) {
    const newHand = Hand.solve(combination, 'bigtwo');
    const samePlayer = G.previous.player === ctx.currentPlayer;

    let win = true;
    let sameLength = true;

    const cards = newHand.toArray(true);
    const playerCardsRemain = pullAll(playerCards.slice(), cards);

    if (newHand.isPossible) {
      if (!samePlayer) {
        const lastHand = Hand.solve(G.previous.hand, 'bigtwo');
        win = newHand === Hand.winners([newHand, lastHand])[0];
        sameLength = cards.length === lastHand.cards.length;
      }

      if (win && sameLength) {
        G.players[Number(ctx.currentPlayer)].hand = playerCardsRemain;
        G.previous.hand = cards;
        G.previous.player = ctx.currentPlayer;

        ctx.events.endTurn();

        return G;
      }

      switch (false) {
        case win:
          console.log('This hand lose to last hand');
          break;
        case sameLength:
          console.log('Length of hand is not same');
          break;
        default:
      }
    } else {
      console.log('This hand cannot be solved', cards);
    }
  }

  return INVALID_MOVE;
};
