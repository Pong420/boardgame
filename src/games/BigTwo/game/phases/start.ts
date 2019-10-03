import { ActivePlayers } from 'boardgame.io/core';
import { setup } from '../setup';
import { moves } from '../moves';
import { State, Schema$Phase } from '../../typings';

export const start: Schema$Phase<State> = {
  next: 'ready',
  moves: {
    playCard: moves.playCard,
    setHand: moves.setHand,
    pass: moves.pass
  },
  turn: {
    activePlayers: ActivePlayers.ALL
  },
  endIf: (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].hand.length === 0) {
        return true;
      }
    }
  },
  // @ts-ignore
  onPhaseEnd: (_, ctx) => setup(ctx)
};
