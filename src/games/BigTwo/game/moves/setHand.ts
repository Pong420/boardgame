import { Schema$Move } from '../../../../typings';

export const setHand: Schema$Move = (G, ctx, hand: string[]) => {
  G.players[Number(ctx.currentPlayer)].hand = hand;
};
