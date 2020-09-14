import React, { useMemo, Suspense, ReactNode } from 'react';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { MatchState } from '@/services';
import { Redirect } from '../Redirect';
import styles from './Match.module.scss';

interface Props {
  spectate?: boolean;
  state: MatchState;
}

const handleImport = (name: string) =>
  Promise.all([
    import(`../../games/${name}/game`),
    import(`../../games/${name}/board`)
  ]);

export function MatchContent({ spectate, state }: Props) {
  const { ClientComponent } = useMemo(() => {
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
      <Suspense fallback={null}>{getContent()}</Suspense>
    </div>
  );
}
