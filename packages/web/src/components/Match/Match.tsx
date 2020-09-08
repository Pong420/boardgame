import React, { useMemo, Suspense } from 'react';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { MatchState } from '@/services';
import { MatchHeader } from './MatchHeader';

const handleImport = (name: string) =>
  Promise.all([
    import(`@boardgame/${name}/dist/game`),
    import(`@boardgame/${name}/dist/board`)
  ]);

export function Match(state: MatchState) {
  const ClientComponent = useMemo(
    () =>
      React.lazy(() =>
        handleImport(state.name).then(([{ game }, { Board }]) => ({
          default: Client({
            debug: false,
            game: game as Game,
            board: Board,
            numPlayers: state.numPlayers,
            multiplayer:
              'local' in state
                ? (Local() as any) // FIXME:
                : SocketIO({
                    server:
                      process.env.NODE_ENV === 'development'
                        ? `http://localhost:8080`
                        : window.location.origin
                  })
          })
        }))
      ),
    [state]
  );

  const isSSR = typeof window === 'undefined';

  if (isSSR) {
    return <div />;
  }

  return (
    <div className="match">
      <MatchHeader name={state.name} local={'local' in state} />
      <div
        className={[
          'match-content',
          `num-of-player-${state.numPlayers}`,
          'local' in state ? 'local' : 'multi',
          state.name
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Suspense fallback={null}>
          {'local' in state ? (
            Array.from({ length: state.numPlayers }, (_, index) => (
              <ClientComponent
                key={index}
                playerID={`${index}`}
                matchID={`${state.name}-${+new Date()}`}
              />
            ))
          ) : (
            <ClientComponent
              matchID={state.matchID}
              playerID={state.playerID}
              credentials={state.credentials}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
