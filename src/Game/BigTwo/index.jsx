import React from 'react';
import { Client } from 'boardgame.io/react';
import BigTwo from './game';
import BigTwoBoard from './components/BigTwoBoard';

import './index.scss';

function BigTwoLocal(props) {
  const numPlayers = Math.max(2, props.match.params.numPlayers || 4);
  const gameID = 'gameId';
  const PockerClient = Client({
    debug: false,
    game: BigTwo,
    board: BigTwoBoard,
    numPlayers,
    multiplayer: { local: true }
  });

  const client = [];

  for (let i = 0; i < numPlayers; i++) {
    client.push(<PockerClient gameID={gameID} playerID={`${i}`} key={i} />);
  }

  return <div id="big-two-local">{client}</div>;
}

export default BigTwoLocal;
