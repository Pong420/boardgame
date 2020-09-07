import React, { useMemo, Suspense } from 'react';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';

interface Props {
  name: string;
  playerID: string;
  credentials: string;
}

const handleImport = (name: string) =>
  Promise.all([
    import(`@boardgame/${name}/dist/game`),
    import(`@boardgame/${name}/dist/board`)
  ]).then(([{ game }, { Board }]) => ({
    default: Client({
      debug: false,
      game: game as Game,
      board: Board,
      multiplayer: SocketIO({
        server:
          process.env.NODE_ENV === 'development'
            ? `http://localhost:8080`
            : window.location.origin
      })
    })
  }));

export function Match({ name, playerID, credentials }: Props) {
  const ClientComponent = useMemo(() => React.lazy(() => handleImport(name)), [
    name
  ]);

  const isSSR = typeof window === 'undefined';

  if (isSSR) {
    return <div />;
  }

  return (
    <div className="match">
      <div className="match-header"></div>
      <Suspense fallback={null}>
        <ClientComponent playerID={playerID} credentials={credentials} />
      </Suspense>
    </div>
  );
}
