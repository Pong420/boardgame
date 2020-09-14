import React, { useMemo, Suspense, ReactNode } from 'react';
import router from 'next/router';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { useRxAsync } from 'use-rx-hooks';
import { MatchState, getMatch, matchStorage } from '@/services';
import { Toaster } from '@/utils/toaster';
import { gameMetaMap } from '@/games';
import { ApiError } from '@/typings';
import { Redirect } from '../Redirect';
import { ShareButton } from '../ShareButton';
import { Preferences } from '../Preferences';
import { MatchHeader } from './MatchHeader';
import styles from './Match.module.scss';

interface State {
  matchName: string;
  spectate?: boolean;
}

const handleImport = (name: string) =>
  Promise.all([
    import(`../../games/${name}/game`),
    import(`../../games/${name}/board`)
  ]);

const onFailure = (error: ApiError) => {
  // match not found
  if (
    typeof error == 'object' &&
    'response' in error &&
    error.response?.status === 404 &&
    matchStorage.get()
  ) {
    matchStorage.save(null);
  } else {
    Toaster.apiError('Get Match Failure', error);
  }
  router.push('/');
};

export function Match(state: MatchState) {
  const { ClientComponent, _getMatch } = useMemo(() => {
    const ClientComponent = React.lazy(() =>
      handleImport(state.name).then(([{ game }, { Board }]) => ({
        default: Client({
          debug: false,
          game: game as Game,
          board: Board,
          loading: () => (
            <div className={styles['match-content-loading']}>Loading...</div>
          ),
          numPlayers: 'local' in state ? state.numPlayers : undefined,
          multiplayer:
            'local' in state
              ? (Local() as any) // FIXME:
              : SocketIO({ server: window.location.origin })
        })
      }))
    );

    const _getMatch = async (): Promise<State> => {
      if ('local' in state) {
        return { matchName: 'Local' };
      }

      const { data } = await getMatch({
        name: state.name,
        matchID: state.matchID
      });

      return data.setupData
        ? {
            ...data,
            ...data.setupData
          }
        : Promise.reject('Invalid match');
    };

    return { ClientComponent, _getMatch };
  }, [state]);

  const isSSR = typeof window === 'undefined';
  const [{ data }] = useRxAsync(_getMatch, { onFailure });

  if (isSSR || !data) {
    return <div />;
  }

  const { matchName, spectate } = data;
  const { gameName } = gameMetaMap[state.name];

  const getContent = (): ReactNode => {
    if ('local' in state) {
      return Array.from({ length: state.numPlayers }, (_, idx) => (
        <ClientComponent
          key={idx}
          playerID={`${idx}`}
          matchID={`${state.name}-${+new Date()}`}
        />
      ));
    }

    if ('playerName' in state) {
      return (
        <ClientComponent
          matchID={state.matchID}
          playerID={state.playerID}
          credentials={state.credentials}
        />
      );
    }

    if (spectate) {
      return (
        <ClientComponent matchID={state.matchID} playerID={state.playerID} />
      );
    }

    return <Redirect />;
  };

  return (
    <div className={styles['match']}>
      <MatchHeader title={`${gameName} - ${matchName}`}>
        {'playerName' in state && (
          <ShareButton
            gameName={gameName}
            name={state.name}
            matchID={state.matchID}
            playerName={state.playerName}
          />
        )}
        <Preferences disablePlayerName />
      </MatchHeader>
      <div
        className={[
          styles['match-content'],
          ...('local' in state
            ? ['local', `num-of-player-${state.numPlayers}`]
            : ['multi']),
          state.name
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Suspense fallback={null}>{getContent()}</Suspense>
      </div>
    </div>
  );
}
