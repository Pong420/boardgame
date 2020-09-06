import React, { useMemo, Suspense } from 'react';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { RouteComponentProps } from '@/typings';

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

interface Context {
  name: string;
}

export default function (props: RouteComponentProps<unknown, Context>) {
  const isSSR = typeof window === 'undefined';

  const ClientComponent = useMemo(
    () => React.lazy(() => handleImport(props.pageContext.name)),
    [props.pageContext.name]
  );

  return (
    <div>
      {!isSSR && (
        <Suspense fallback={null}>
          <ClientComponent />
        </Suspense>
      )}
    </div>
  );
}
