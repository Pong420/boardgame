import { BigTwoState, BigTwoCtx } from '../../typings';

export const ready = (G: BigTwoState, _ctx: BigTwoCtx, playerID: string) => {
  G.players[Number(playerID)].ready = true;
};
