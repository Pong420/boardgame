import React, { Suspense } from 'react';
import { RouteComponentProps, Redirect, generatePath } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { server, PATHS } from '../../constants';

export interface PlaygroundRouteState {
  name: string;
  playerID: string;
  credentials: string;
}

interface Props
  extends RouteComponentProps<{}, {}, PlaygroundRouteState | undefined> {}

export function Playground({ location }: Props) {
  if (location.state) {
    const { name, playerID, credentials } = location.state;
    const ClientComponent = React.lazy(() =>
      Promise.all([
        import(`@boardgame/${name}/dist/game`).then(
          ({ BigTwo }) => BigTwo as Game
        ),
        import(`@boardgame/${name}/dist/board`).then(
          ({ BigTwoBoard }) => BigTwoBoard
        )
      ]).then(([game, board]) => ({
        default: Client({
          debug: false,
          game,
          board,
          multiplayer: SocketIO({ server })
        })
      }))
    );

    return (
      <div className="playground">
        <div className="playgroud-header">
          <Button icon="arrow-left" />
          <div />
          <div />
        </div>
        <div className="playground-content">
          <Suspense fallback={null}>
            <ClientComponent playerID={playerID} credentials={credentials} />
          </Suspense>
        </div>
      </div>
    );
  }

  return <Redirect to={generatePath(PATHS.HOME, {})} />;
}
