import { Prefix_State, Prefix_Ctx } from '../../typings';

export const ready = (
  G: Prefix_State,
  _ctx: Prefix_Ctx,
  playerID: string
) => {
  G.players[Number(playerID)].ready = true;
};
