import React, { useMemo, Suspense } from 'react';
import { AxiosError } from 'axios';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { useRxAsync } from 'use-rx-hooks';
import { MatchState, getMatch, matchStorage } from '@/services';
import { Toaster } from '@/utils/toaster';
import { Redirect } from '../Redirect';
import { MatchHeader } from './MatchHeader';

interface State {
  matchName: string;
  gameName: string;
  spectate?: boolean;
}

const handleImport = (name: string) =>
  Promise.all([
    import(`../../games/${name}/game`),
    import(`../../games/${name}/board`)
  ]);

const onFailure = (error: AxiosError) => {
  // match not found
  if (error.response?.status === 404 && matchStorage.get()) {
    matchStorage.save(null);
  } else {
    Toaster.apiError('Get Match Failure', error);
  }
  return <Redirect />;
};

export function Match(state: MatchState) {
  const { ClientComponent, _getMatch } = useMemo(() => {
    const ClientComponent = React.lazy(() =>
      handleImport(state.name).then(([{ game }, { Board }]) => ({
        default: Client({
          debug: false,
          game: game as Game,
          board: Board,
          loading: () => <div className="loading">Loading...</div>,
          numPlayers: 'local' in state ? state.numPlayers : undefined,
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
    );

    const _getMatch = () =>
      'local' in state
        ? Promise.resolve<State>({
            matchName: 'Local',
            gameName: state.gameName
          })
        : getMatch({
            name: state.name,
            matchID: state.matchID
          }).then<State>(({ data }) => {
            return data.setupData
              ? { ...data, ...data.setupData }
              : Promise.reject('Invalid match');
          });

    return { ClientComponent, _getMatch };
  }, [state]);

  const isSSR = typeof window === 'undefined';
  const [{ data }] = useRxAsync(_getMatch, { onFailure });

  if (isSSR || !data) {
    return <div />;
  }

  const { matchName, gameName, spectate } = data;

  return (
    <div className="match">
      <MatchHeader name={state.name} title={`${gameName} - ${matchName}`} />
      <div
        className={[
          'match-content',
          ...('local' in state
            ? ['local', `num-of-player-${state.numPlayers}`]
            : ['multi']),
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
          ) : 'credentials' in state ? (
            <ClientComponent
              matchID={state.matchID}
              playerID={state.playerID}
              credentials={state.credentials}
            />
          ) : spectate ? (
            <ClientComponent
              matchID={state.matchID}
              playerID={state.playerID}
            />
          ) : (
            <Redirect />
          )}
        </Suspense>
      </div>
    </div>
  );
}
