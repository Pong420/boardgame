import React, { useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Client } from 'boardgame.io/react';
import { BigTwo, BigTwoBoard } from '../games/BigTwo';

interface MatchParams {
  numPlayers?: string;
}

const gameID = 'big-two' + Date.now();

export function BigTwoLocalClient({ match }: RouteComponentProps<MatchParams>) {
  const numPlayers = Math.max(2, +(match.params.numPlayers || 4));
  const ClientComponent = useMemo(
    () =>
      Client({
        debug: false,
        game: BigTwo,
        board: BigTwoBoard,
        numPlayers,
        multiplayer: { local: true }
      }),
    [numPlayers]
  );

  const client = [];

  for (let i = 0; i < numPlayers; i++) {
    client.push(<ClientComponent gameID={gameID} playerID={`${i}`} key={i} />);
  }

  return <div id="big-two-local">{client}</div>;
}

export { BigTwoLocalClient as default };
