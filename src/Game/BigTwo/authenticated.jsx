import React from 'react';
import { Client } from 'boardgame.io/react';

import Join from '../../Join';
import BigTwo from './game';
import BigTwoBoard from './components/BigTwoBoard/';

import './index.scss';

const { REACT_APP_REMOTE_SERVER, REACT_APP_REMOTE_SERVER_PORT } = process.env;

const BigTwoClient = Client({
  debug: false,
  game: BigTwo,
  board: BigTwoBoard,
  multiplayer: {
    server: `${REACT_APP_REMOTE_SERVER}:${REACT_APP_REMOTE_SERVER_PORT}`
  }
});

function AuthenticatedClient(props) {
  const { gameID, playerID, credentials } = props.match.params;
  const requiredProps = { gameID, playerID, credentials };

  return (
    <Join gameName="big-two" {...props} {...requiredProps}>
      {playerName => {
        return (
          <div className="big-two-authenticated game">
            <BigTwoClient {...requiredProps} playerName={playerName} />
          </div>
        );
      }}
    </Join>
  );
}

export default AuthenticatedClient;
