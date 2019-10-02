import { State, Schema$Move } from '../../typings';

export const setHand: Schema$Move<State> = (G, ctx, hand: string[]) => {
  G.players[Number(ctx.currentPlayer)].hand = hand;
};
