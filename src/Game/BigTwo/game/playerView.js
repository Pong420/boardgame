import { PlayerView } from 'boardgame.io/core';

export default function playerView(G, ctx, playerID) {
  let r = { ...G };
  const { numPlayers } = ctx;

  if (r.secret !== undefined) {
    r.otherPlayers = (idx => {
      const otherPlayers = [];
      while (otherPlayers.length < numPlayers - 1) {
        idx = (numPlayers + idx + 1) % numPlayers;

        const player = G.players[idx];

        otherPlayers.push({
          ...player,
          id: idx,
          cards: player.cards.length
        });
      }

      return otherPlayers;
    })(Number(playerID));
  }

  return PlayerView.STRIP_SECRETS(r, ctx, playerID);
}
