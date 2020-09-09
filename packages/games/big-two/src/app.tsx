import React from 'react';
import ReactDOM from 'react-dom';
import { Game } from 'boardgame.io';
import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { Board } from './board';
import { game } from './game';

const ClientComponent = Client({
  debug: false,
  board: Board,
  game: game as Game,
  numPlayers: 2,
  multiplayer: Local() as any
});

const App = () => {
  return (
    <>
      <ClientComponent matchID="default" playerID="0" />
      <ClientComponent matchID="default" playerID="1" />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
