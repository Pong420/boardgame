/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React, { ReactNode } from 'react';
import { PlayAgain } from '@/components/PlayAgain';
import { Disconnected } from '@/components/Match';
import { TicTacToeBoardProps } from '../typings';
import { Cell } from './Cell';
import { Text } from './Text';

const symbol = (playerID: string) =>
  (({ '0': 'O', '1': '✕' } as Record<string, string>)[playerID]);

export function TicTacToeBoard(props: TicTacToeBoardProps) {
  const isActive = (id: number) => {
    return props.isActive && props.G.cells[id] === null;
  };

  const onClick = (id: number) => {
    if (isActive(id)) {
      props.moves.clickCell(id);
    }
  };

  if (!props.isConnected) {
    return <Disconnected />;
  }

  const tbody: ReactNode[] = [];
  for (let i = 0; i < 3; i++) {
    const cells: ReactNode[] = [];
    for (let j = 0; j < 3; j++) {
      const id = 3 * i + j;
      cells.push(
        <Cell
          key={id}
          className={['cell', isActive(id) && 'active']
            .filter(Boolean)
            .join(' ')}
          onClick={() => onClick(id)}
        >
          {symbol(String(props.G.cells[id]))}
        </Cell>
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  let turn: ReactNode = (
    <Text>
      {props.playerID
        ? props.playerID === props.ctx.currentPlayer
          ? 'Your turn'
          : 'Waiting for ohter player'
        : `Player ${symbol(props.ctx.currentPlayer)}'s turn`}
    </Text>
  );

  let winner: ReactNode = null;

  if (props.ctx.gameover) {
    turn = null;

    winner = (
      <Text>
        {props.ctx.gameover === 'draw'
          ? 'Draw'
          : props.playerID
          ? props.ctx.gameover === props.playerID
            ? 'You win'
            : 'You lose'
          : `Player ${symbol(props.ctx.gameover)} win`}
      </Text>
    );
  }

  return (
    <div className="container">
      <Text>{props.playerID && `You are -  ${symbol(props.playerID)}`}</Text>

      <table className="board">
        <tbody>{tbody}</tbody>
      </table>

      {turn}

      {winner}

      <div className="actions">
        {props.credentials && props.ctx.gameover && props.playerID && (
          <PlayAgain />
        )}
      </div>

      <style jsx global>{`
        .tic-tac-toe {
          .bgio-client {
            @include flex(center, center);
            text-align: center;
          }

          &.local.num-of-player-2 {
            .bgio-client {
              height: 50%;
            }
          }
        }
      `}</style>

      <style jsx>{`
        .container {
          @include dimen(100%);
        }

        .board {
          margin: auto;
        }

        .actions {
          min-height: 30px;
        }
      `}</style>
    </div>
  );
}
