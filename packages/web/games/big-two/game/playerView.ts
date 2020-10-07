import { PlayerView } from 'boardgame.io/core';
import { BigTwoPlayerView } from '../typings';

export const playerView: BigTwoPlayerView = (G, ctx, playerID) => {
  const R = { ...G };
  const { numPlayers } = ctx;
  const isLocalGamePlay = R.opponents.length === 0;

  R.opponents = isLocalGamePlay
    ? (idx => {
        const opponents = [];
        while (opponents.length < numPlayers - 1) {
          idx = (numPlayers + idx + 1) % numPlayers;

          const { hand, ...rest } = G.players[String(idx)] || {};

          opponents.push({
            ...rest,
            id: String(idx),
            numOfCards: hand.length
          });
        }

        return opponents;
      })(Number(playerID))
    : R.opponents.map(({ hand, ...rest }) => rest);

  return PlayerView.STRIP_SECRETS(R, ctx, playerID);
};
