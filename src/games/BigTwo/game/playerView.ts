import { PlayerView } from 'boardgame.io/core';
import { Schema$PlayerView } from '../../../typings';

export const playerView: Schema$PlayerView = (G, ctx, playerID) => {
  let r = { ...G };
  const { numPlayers } = ctx;

  if (r.secret !== undefined) {
    r.opponents = (idx => {
      const opponents = [];
      while (opponents.length < numPlayers - 1) {
        idx = (numPlayers + idx + 1) % numPlayers;

        const player = G.players[idx];

        opponents.push({
          ...player,
          id: idx,
          numOfCards: player.hand.length
        });
      }

      return opponents;
    })(Number(playerID));
  }

  return PlayerView.STRIP_SECRETS(r, ctx, playerID);
};
