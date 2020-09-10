import React from 'react';
import ReactDOM from 'react-dom';
import { Game } from 'boardgame.io';
import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { Board } from './board';
import { game } from './game';

import './app.scss';

const numPlayers = 2;

const ClientComponent = Client({
  debug: false,
  board: Board,
  game: game as Game,
  numPlayers,
  multiplayer: Local() as any
});

const App = () => {
  return (
    <>
      {Array.from({ length: numPlayers }, (_, index) => {
        return (
          <ClientComponent
            key={index}
            matchID="default"
            playerID={String(index)}
          />
        );
      })}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('___gatsby'));
