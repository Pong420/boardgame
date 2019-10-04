import { setup } from '../setup';
import { moves } from '../moves';
import { State, Schema$Phase } from '../../typings';

export const start: Schema$Phase<State> = {
  next: 'ready',
  turn: {
    activePlayers: { player: 'main', others: 'others' },
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
  onEnd: (_, ctx) => setup(ctx) as State
};
