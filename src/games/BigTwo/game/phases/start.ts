import { setup } from '../setup';
import { moves } from '../moves';
import { State, Schema$Phase, Action } from '../../typings';

// TODO: make it better

const callback: Action<State> = (G, { numPlayers, currentPlayer, events }) => {
  const value: Record<string, string> = {};
  const idx = (numPlayers + Number(currentPlayer)) % numPlayers;

  for (let i = 0; i < numPlayers; i++) {
    value[i] = idx === i ? 'main' : 'others';
  }
  events.setActivePlayers({ value });
  return G;
};

export const start: Schema$Phase<State> = {
  next: 'ready',
  turn: {
    stages: {
      main: {
        moves: {
          playCard: (G, ctx, ...args) => {
            if (typeof moves.playCard === 'function') {
              moves.playCard(G, ctx, ...args);
            }

            const { numPlayers, currentPlayer, events } = ctx;
            const value: Record<string, string> = {};
            const idx = (numPlayers + Number(currentPlayer) + 1) % numPlayers;

            for (let i = 0; i < numPlayers; i++) {
              value[i] = idx === i ? 'main' : 'others';
            }
            events.setActivePlayers({ value });
          },
          pass: moves.pass,
          setHand: moves.setHand
        }
      },
      others: {
        moves: {
          setHand: moves.setHand
        }
      }
    },
    onBegin: callback
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
