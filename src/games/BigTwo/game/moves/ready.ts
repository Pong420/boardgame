import { Schema$Move } from '../../../../typings';

export const ready: Schema$Move = (G, _, playerID: string) => {
  G.players[Number(playerID)].ready = true;
};
