import { State, Schema$Move } from '../../typings';

export const ready: Schema$Move<State> = (G, _, playerID: string) => {
  G.players[Number(playerID)].ready = true;
};
