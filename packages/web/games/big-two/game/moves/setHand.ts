import { BigTwoState, BigTwoCtx } from '../../typings';

export const setHand = (G: BigTwoState, ctx: BigTwoCtx, hand: string[]) => {
  if (typeof ctx.playerID !== 'undefined') {
    G.players[ctx.playerID].hand = hand;
  } else {
    console.error('setHand: ctx.playerID is not defined');
  }
};
