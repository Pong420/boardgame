import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Client } from 'boardgame.io/react';
import { BigTwo, BigTwoBoard } from '../games/BigTwo';
import { server } from '../constants';

interface MatchParams {
  gameID: string;
  playerID: string;
  credentials: string;
}

const ClientComponent = Client({
  debug: false,
  game: BigTwo,
  board: BigTwoBoard,
  multiplayer: {
    server
  }
});

export function BigTwoClient({ match }: RouteComponentProps<MatchParams>) {
  const { gameID, playerID, credentials } = match.params;

  return (
    <div id="big-two">
      <ClientComponent
        gameID={gameID}
        playerID={playerID}
        credentials={credentials}
        playerName={'123123123'}
      />
    </div>
  );
}

export { BigTwoClient as default };
