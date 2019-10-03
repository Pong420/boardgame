import { ActivePlayers } from 'boardgame.io/core';
import { moves } from '../moves';
import { State, Schema$Phase } from '../../typings';

export const ready: Schema$Phase<State> = {
  start: true,
  next: 'draw',
  moves: { ready: moves.ready },
  turn: {
    activePlayers: ActivePlayers.ALL
  },
  onBegin: (G, ctx) => {
    ctx.events.setActivePlayers(['0', '1', '2', '3']);
    return G;
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
