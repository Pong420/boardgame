import React, { useMemo, useState, ReactNode, ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import { Game } from 'boardgame.io';
import { Client } from 'boardgame.io/react';
import { MCTSBot } from 'boardgame.io/ai';
import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { MatchState, isMatchState } from '@/services';
import { Loading } from './CenterText';
import styles from './Match.module.scss';

export interface onGameover {
  onGameover?: () => void;
}

interface Props extends onGameover {
  state: MatchState;
  loading?: boolean;
}

type ClientProps = ComponentProps<ReturnType<typeof Client>> & onGameover;
type ClientOptions = Parameters<typeof Client>[0];

const handleImport = (name: string) =>
  Promise.all([
    import(`../../games/${name}/game`),
    import(`../../games/${name}/board`)
  ]);

export function MatchContent({ state, loading, onGameover }: Props) {
  const { name } = state;
  const [clientOpts] = useState<Partial<ClientOptions>>(() => {
    if (isMatchState(state, 'local')) {
      return {
        numPlayers: state.numPlayers,
        multiplayer: Local() as ClientOptions['multiplayer']
      };
    }

    if (isMatchState(state, 'bot')) {
      const bots: Record<string, typeof MCTSBot> = {};
      for (let i = 1; i < state.numPlayers; i++) {
        bots[i] = MCTSBot;
      }
      return {
        multiplayer: Local({ bots }) as ClientOptions['multiplayer']
      };
    }

    return {
      multiplayer: SocketIO({
        server: typeof window === 'undefined' ? '' : window.location.origin
      })
    };
  });

  const { ClientComponent } = useMemo(() => {
    const ClientComponent = dynamic<ClientProps>(
      () =>
        handleImport(name).then(([{ game }, { Board }]) => {
          const ClientClass = Client({
            debug: false,
            game: game as Game,
            board: Board,
            loading: Loading,
            ...clientOpts
          });

          return class Board extends ClientClass {
            props: ClientProps;

            constructor(props: ClientProps) {
              const { onGameover, ...rest } = props;
              super(rest);
              this.props = props;
            }

            componentDidUpdate(prevProps: ClientProps) {
              const { onGameover, ...rest } = prevProps;

              super.componentDidUpdate?.call(this, rest);

              const isGameover = !!this.client.getState()?.ctx.gameover;
              if (isGameover && onGameover) {
                onGameover();
              }
            }
          };
        }),
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
          matchID={state.matchID}
          onGameover={idx === 0 ? onGameover : undefined}
        />
      ));
    }

    if (isMatchState(state, 'bot')) {
      return (
        <ClientComponent
          playerID="0"
          matchID={state.matchID}
          onGameover={onGameover}
        />
      );
    }

    if (isMatchState(state, 'multi')) {
      return (
        <ClientComponent
          matchID={state.matchID}
          playerID={state.playerID}
          credentials={state.credentials}
          onGameover={onGameover}
        />
      );
    }

    if (isMatchState(state, 'spectate')) {
      return (
        <ClientComponent
          matchID={state.matchID}
          playerID={state.playerID}
          onGameover={onGameover}
        />
      );
    }

    if (loading) {
      return <Loading />;
    }

    // return <Redirect />;
    return null;
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
