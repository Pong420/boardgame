import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Client } from 'boardgame.io/react';
import { gameConfig } from '../../games';

interface MatchParams {
  gameName: string;
  numPlayers: string;
}

export function Local({ match }: RouteComponentProps<MatchParams>) {
  const { gameName, numPlayers: numPlayers_ } = match.params;
  const config = gameConfig[gameName];
  const numPlayers = Number(numPlayers_);

  if (config) {
    const { game, board } = config;
    const ClientComponent = Client({
      debug: false,
      game,
      board,
      numPlayers,
      multiplayer: { local: true }
    });

    return (
      <div className={`local ${gameName}`}>
        {Array.from({ length: numPlayers }, (_, index) => (
          <ClientComponent
            gameID={`${gameName}-local`}
            playerID={`${index}`}
            key={index}
          />
        ))}
      </div>
    );
  }

  return <div>Game not found</div>;
}
