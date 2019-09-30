import React from 'react';
import { Client } from 'boardgame.io/react';
import { BigTwo } from '../../game';
import { BigTwoBoard } from '../BigTwoBoard';

export const server = process.env.REACT_APP_SERVER_PORT
  ? `localhost:${process.env.REACT_APP_SERVER_PORT}`
  : window.location.hostname;

export function Home() {
  const numPlayers = 4;
  const gameID = 'gameId';
  const BigTwoClient = Client({
    debug: false,
    game: BigTwo,
    board: BigTwoBoard,
    numPlayers,
    multiplayer: { server }
  });

  const client = [];

  for (let i = 0; i < numPlayers; i++) {
    client.push(<BigTwoClient gameID={gameID} playerID={`${i}`} key={i} />);
  }

  return <div id="big-two-local">{client}</div>;
}
