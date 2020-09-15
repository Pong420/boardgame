import React, { useMemo, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { MatchState } from '@/services';
import { Redirect } from '../Redirect';
import styles from './Match.module.scss';

interface Props {
  spectate?: boolean;
  state: MatchState;
  loading?: boolean;
}

const handleImport = (name: string) =>
  Promise.all([
    import(`../../games/${name}/game`),
    import(`../../games/${name}/board`)
  ]);

const Loading = () => (
  <div className={styles['match-content-loading']}>Loading...</div>
);

export function MatchContent({ loading, spectate, state }: Props) {
  const { ClientComponent } = useMemo(() => {
    const ClientComponent = dynamic<any>(
      () =>
        handleImport(state.name).then(([{ game }, { Board }]) =>
          Client({
            debug: false,
            game: game as Game,
            board: Board,
            loading: Loading,
            numPlayers: 'local' in state ? state.numPlayers : undefined,
            multiplayer:
              'local' in state
                ? (Local() as any) // FIXME:
                : SocketIO({
                    server:
                      typeof window === 'undefined'
                        ? ''
                        : window.location.origin
                  })
          })
        ),
      { loading: Loading }
    );

    return { ClientComponent };
  }, [state]);

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

    if (loading) {
      return <Loading />;
    }

    return <Redirect />;
  };

  return (
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
      {getContent()}
    </div>
  );
}
