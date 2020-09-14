/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React, { ReactNode } from 'react';
import { PlayAgain } from '@/components/PlayAgain';
import { TicTacToeBoardProps } from '../typings';
import styles from './TicTacToeBoard.module.scss';

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

  const tbody: ReactNode[] = [];
  for (let i = 0; i < 3; i++) {
    const cells: ReactNode[] = [];
    for (let j = 0; j < 3; j++) {
      const id = 3 * i + j;
      cells.push(
        <td
          key={id}
          className={[styles['td'], isActive(id) ? styles['active'] : '']
            .filter(Boolean)
            .join(' ')}
          onClick={() => onClick(id)}
        >
          {symbol(String(props.G.cells[id]))}
        </td>
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  let turn: ReactNode = (
    <div className={styles['turn']}>
      {props.playerID
        ? props.playerID === props.ctx.currentPlayer
          ? 'Your turn'
          : 'Waiting for ohter player'
        : `Player ${symbol(props.ctx.currentPlayer)}'s turn`}
    </div>
  );

  let winner: ReactNode = null;

  if (props.ctx.gameover) {
    turn = null;

    winner = (
      <div className={styles['winner']}>
        {props.ctx.gameover === 'draw'
          ? 'Draw'
          : props.playerID
          ? props.ctx.gameover === props.playerID
            ? 'You win'
            : 'You lose'
          : `Player ${symbol(props.ctx.gameover)} win`}
      </div>
    );
  }

  return (
    <div className={styles['container']}>
      <div className={styles['head']}>
        {props.playerID && `You are -  ${symbol(props.playerID)}`}
      </div>

      <table className={styles['board']}>
        <tbody>{tbody}</tbody>
      </table>

      {turn}

      {winner}

      <div className={styles['actions']}>
        {props.ctx.gameover && props.playerID && <PlayAgain />}
      </div>

      <style jsx global>{`
        .tic-tac-toe.local.num-of-player-2 .bgio-client {
          height: 50%;
        }

        .tic-tac-toe .bgio-client {
          display: flex;
          align-items: center;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
