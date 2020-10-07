import { TurnOrder } from 'boardgame.io/core';
import { setup } from './setup';
import { playerView } from './playerView';
import { moves } from './moves';
import { BigTwoGame, BigTwoGameOver } from '../typings';

export const game: BigTwoGame = {
  name: 'big-two',
  moves,
  setup,
  playerView,
  minPlayers: 2,
  maxPlayers: 4,
  disableUndo: true,
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
  endIf: (G): BigTwoGameOver | undefined => {
    for (const key in G.players) {
      if (G.players[key].hand.length === 0) {
        return key;
      }
    }
  }
};
