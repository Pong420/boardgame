import { PlayerView } from 'boardgame.io/core';
import { Prefix_PlayerView } from '../typings';

export const playerView: Prefix_PlayerView = (G, ctx, playerID) => {
  let R = { ...G };
  const { numPlayers } = ctx;
  const isLocalGamePlay = R.secret !== undefined;

  if (isLocalGamePlay) {
    R.opponents = (idx => {
      const opponents = [];
      while (opponents.length < numPlayers - 1) {
        idx = (numPlayers + idx + 1) % numPlayers;

        // const player =  G.players[String(idx);
        opponents.push({
          id: String(idx)
        });
      }

      return opponents;
    })(Number(playerID));
  } else {
    R = {
      ...R,
      // TODO: remove secret values
      opponents: R.opponents.map(({ ...rest }) => rest)
    };
  }

  return PlayerView.STRIP_SECRETS(R, ctx, playerID);
};
