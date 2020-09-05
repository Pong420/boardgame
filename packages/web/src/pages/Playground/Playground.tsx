import React, { Suspense } from 'react';
import { RouteComponentProps, Redirect, generatePath } from 'react-router-dom';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { server, PATHS } from '../../constants';

export interface PlaygroundRouteState {
  name: string;
  playerID: string;
  credentials: string;
}

const getClint = () =>
  Promise.all([
    import(`@boardgame/big-two/dist/game`).then(({ BigTwo }) => BigTwo as Game),
    import(`@boardgame/big-two/dist/board`).then(
      ({ BigTwoBoard }) => BigTwoBoard
    ),
    // @ts-ignore
    import(`@boardgame/big-two/dist/board/index.css`)
  ]).then(([game, board]) => ({
    default: Client({
      debug: false,
      game,
      board,
      multiplayer: SocketIO({ server })
    })
  }));

interface Props
  extends RouteComponentProps<{}, {}, PlaygroundRouteState | undefined> {}

export function Playground({ location }: Props) {
  if (location.state) {
    const { playerID, credentials } = location.state;
    const ClientComponent = React.lazy(() => getClint());

    return (
      <div className="playground">
        <div className="playgroud-header">{/*  */}</div>
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
