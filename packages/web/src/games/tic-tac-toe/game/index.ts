/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import {
  Cell,
  TicTacToeGame,
  TicTacToeState,
  TicTacToePhaseConfig
} from '../typings';
import { ActivePlayers, TurnOrder } from 'boardgame.io/core';

function IsVictory(cells: Cell[]) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const isRowComplete = (row: number[]) => {
    const symbols = row.map(i => cells[i]);
    return symbols.every(i => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some(i => i === true);
}

const commonPhase: TicTacToePhaseConfig = {
  turn: {
    activePlayers: ActivePlayers.ALL
  },

  moves: {
    ok: {
      redact: false,
      move: (G, ctx, playerID) => {
        if (ctx.playerID === playerID && playerID) {
          G.flag[playerID] = true;
        }
      }
    }
  },
  endIf: G => G.flag['0'] && G.flag['1']
};

export const game: TicTacToeGame = {
  name: 'tic-tac-toe',

  setup: (): TicTacToeState => ({
    cells: new Array(9).fill(null),
    flag: { '0': false, '1': false },
    result: null
  }),

  phases: {
    ready: {
      ...commonPhase,
      start: true,
      next: 'start'
    },

    ended: {
      ...commonPhase,
      next: 'start',
      onEnd: (_G, ctx) => {
        return game.setup!(ctx);
      }
    },

    start: {
      next: 'ended',
      moves: {
        clickCell: {
          redact: false,
          move: (G, ctx, id) => {
            const cells = [...G.cells];

            if (cells[id] === null) {
              cells[id] = Number(ctx.currentPlayer);

              let result = null;

              if (IsVictory(cells)) {
                result = ctx.playerID;
              }

              if (cells.filter(c => c === null).length === 0) {
                result = 'draw';
              }

              return { ...G, cells, result };
            }
          }
        }
      },
      onEnd: G => {
        G.flag['0'] = false;
        G.flag['1'] = false;
      },
      endIf: G => !!G.result
    }
  },

  turn: {
    moveLimit: 1,
    order: TurnOrder.CONTINUE
  },

  ai: {
    enumerate: G => {
      const r: Array<{ move: string; args: Cell[] }> = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          r.push({ move: 'clickCell', args: [i] });
        }
      }
      return r;
    }
  }
};
