import React, { useMemo, useState, ReactNode, ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { MatchState, isMatchState } from '@/services';
import { Redirect } from '../Redirect';
import { Loading } from './CenterText';
import styles from './Match.module.scss';

interface Props {
  state: MatchState;
  loading?: boolean;
  isSpectator?: boolean;
}

const handleImport = (name: string) =>
  Promise.all([
    import(`../../games/${name}/game`),
    import(`../../games/${name}/board`)
  ]);

export function MatchContent({ state, loading, isSpectator }: Props) {
  const { name } = state;
  const [clientOpts] = useState<Partial<Parameters<typeof Client>[0]>>({
    ...(isMatchState(state, 'local')
      ? { numPlayers: state.numPlayers, multiplayer: Local() as any }
      : {
          multiplayer: SocketIO({
            server: typeof window === 'undefined' ? '' : window.location.origin
          })
        })
  });

  const { ClientComponent } = useMemo(() => {
    const ClientComponent = dynamic<ComponentProps<ReturnType<typeof Client>>>(
      () =>
        handleImport(name).then(([{ game }, { Board }]) =>
          Client({
            debug: false,
            game: game as Game,
            board: Board,
            loading: Loading,
            ...clientOpts
          })
        ),
      { loading: Loading, ssr: false }
    );

    return { ClientComponent };
  }, [name, clientOpts]);

  const getContent = (): ReactNode => {
    if (isMatchState(state, 'local')) {
      return Array.from({ length: state.numPlayers }, (_, idx) => (
        <ClientComponent
          key={idx}
          playerID={`${idx}`}
          matchID={`${state.name}-${+new Date()}`}
        />
      ));
    }

    if (isMatchState(state, 'multi')) {
      return (
        <ClientComponent
          matchID={state.matchID}
          playerID={state.playerID}
          credentials={state.credentials}
        />
      );
    }

    if (isSpectator) {
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
        ...(isMatchState(state, 'local')
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
