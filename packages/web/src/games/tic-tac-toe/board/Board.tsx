/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React, { ReactNode } from 'react';
import { TicTacToeBoardProps } from '../typings';

export function Board(props: TicTacToeBoardProps) {
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
          className={isActive(id) ? 'active' : ''}
          onClick={() => onClick(id)}
        >
          {props.G.cells[id]}
        </td>
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  let disconnected = null;
  if (props.isMultiplayer && !props.isConnected) {
    disconnected = <div>Disconnected!</div>;
  }

  if (Array.isArray(props.matchData)) {
    if (props.matchData.some(d => typeof d.name === 'undefined')) {
      return 'Waiting for other join the game';
    }
  }

  let winner = null;
  if (props.ctx.gameover) {
    winner =
      props.ctx.gameover.winner !== undefined ? (
        <div id="winner">Winner: {props.ctx.gameover.winner}</div>
      ) : (
        <div id="winner">Draw!</div>
      );
  }

  let turn = null;
  if (props.playerID) {
    turn = (
      <div id="turn">
        {props.playerID === props.ctx.currentPlayer
          ? 'Your turn'
          : 'Waiting for ohter player'}
      </div>
    );
  }

  if (props.isPreview) {
    disconnected = turn = null;
  }

  return (
    <div>
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {turn}
      {winner}
      {disconnected}
    </div>
  );
}
