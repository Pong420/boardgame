import { TurnOrder } from 'boardgame.io/core';
import { setup } from '../setup';
import { moves } from '../moves';
import { BigTwoPhaseConfig } from '../../typings';

export const start: BigTwoPhaseConfig = {
  next: 'ready',
  turn: {
    order: TurnOrder.RESET,
    activePlayers: { currentPlayer: 'main', others: 'others' },
    stages: {
      main: {
        moves: {
          playCard: moves.playCard,
          pass: moves.pass,
          setHand: moves.setHand
        }
      },
      others: {
        moves: {
          setHand: moves.setHand
        }
      }
    }
  },
  endIf: (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].hand.length === 0) {
        return true;
      }
    }
  },
  onEnd: (_, ctx) => setup(ctx)
};
