import { ActivePlayers } from 'boardgame.io/core';
import { moves } from '../moves';
import { Prefix_PhaseConfig } from '../../typings';

export const ready: Prefix_PhaseConfig = {
  start: true,
  next: 'start',
  moves: { ready: moves.ready },
  turn: {
    activePlayers: ActivePlayers.ALL
  },
  endIf: (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].ready === false) {
        return false;
      }
    }
    return true;
  }
};
