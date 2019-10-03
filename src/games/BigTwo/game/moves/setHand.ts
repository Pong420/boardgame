import { State, Schema$Move } from '../../typings';

export const setHand: Schema$Move<State> = (G, ctx, hand: string[]) => {
  G.players[ctx.playerID].hand = hand;
};
