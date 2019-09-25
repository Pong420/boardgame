import React from 'react';
import { Client } from 'boardgame.io/react';
import { BigTwo } from '../../game';
import { BigTwoBoard } from '../BigTwoBoard';

export function Home() {
  const numPlayers = 4;
  const gameID = 'gameId';
  const BigTwoClient = Client({
    debug: false,
    game: BigTwo,
    board: BigTwoBoard,
    numPlayers,
    multiplayer: { local: true }
  });

  const client = [];

  for (let i = 0; i < numPlayers; i++) {
    client.push(<BigTwoClient gameID={gameID} playerID={`${i}`} key={i} />);
  }

  return <div id="big-two-local">{client}</div>;
}
