import { PlayerView } from 'boardgame.io/core';
import { BigTwoPlayerView } from '../typings';

export const playerView: BigTwoPlayerView = (G, ctx, playerID) => {
  let R = { ...G };
  const { numPlayers } = ctx;
  const isLocalGamePlay = R.secret !== undefined;

  if (isLocalGamePlay) {
    R.opponents = (idx => {
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
  } else {
    R = {
      ...R,
      opponents: R.opponents.map(({ hand, ...rest }) => rest)
    };
  }

  // console.log(ctx.player);
  return PlayerView.STRIP_SECRETS(R, ctx, playerID);
};
