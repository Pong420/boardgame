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
  TicTacToeGameOver
} from '../typings';
import { INVALID_MOVE, TurnOrder } from 'boardgame.io/core';

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

function IsDraw(cells: Cell[]) {
  return cells.filter(c => c === null).length === 0;
}

export const game: TicTacToeGame = {
  name: 'tic-tac-toe',

  setup: (): TicTacToeState => ({
    cells: new Array(9).fill(null)
  }),

  moves: {
    clickCell: (G, ctx, id: number) => {
      if (G.cells[id] !== null) {
        return INVALID_MOVE;
      }
      G.cells[id] = Number(ctx.currentPlayer);
    }
  },

  endIf: (G, ctx): TicTacToeGameOver | undefined => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
  },

  turn: {
    moveLimit: 1,
    order: TurnOrder.CONTINUE
  },

  ai: {
    enumerate: G => {
      const r = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          r.push({ move: 'clickCell', args: [i] });
        }
      }
      return r;
    }
  }
};
