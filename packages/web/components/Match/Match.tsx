import React, { useCallback, useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { MatchState, getMatch, matchStorage } from '@/services';
import { Toaster } from '@/utils/toaster';
import { gameMetaMap } from '@/games';
import { ApiError } from '@/typings';
import { Chat } from '../Chat';
import { ShareButton } from '../ShareButton';
import { Preferences } from '../Preferences';
import { MatchHeader } from './MatchHeader';
import { MatchContent } from './MatchContent';
import styles from './Match.module.scss';

interface State {
  matchName: string;
  spectate?: boolean;
  numPlayers: number;
}

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
  const _getMatch = useCallback(async (): Promise<State> => {
    if ('local' in state) {
      return { matchName: 'Local', numPlayers: 0 };
    }

    const { data } = await getMatch({
      name: state.name,
      matchID: state.matchID
    });

    return data.setupData
      ? {
          ...data,
          ...data.setupData,
          numPlayers: data.players.length
        }
      : Promise.reject('Invalid match');
  }, [state]);

  const [{ data, loading }] = useRxAsync(_getMatch, { onFailure });
  const { matchName, spectate } = data || {};
  const { gameName } = gameMetaMap[state.name];
  const [started, setStarted] = useState(!('playerName' in state));

  const onReady = useCallback(
    (payload: string[]) =>
      setStarted(!!data && payload.length === data.numPlayers),
    [data]
  );

  return (
    <div className={styles['match']}>
      <MatchHeader title={[gameName, matchName].filter(Boolean).join(' - ')}>
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
      {'playerName' in state && data && (
        <Chat
          matchID={state.matchID}
          playerID={state.playerID}
          playerName={state.playerName}
          credentials={state.credentials}
          start={started}
          onReady={onReady}
        />
      )}
      {started && (
        <MatchContent
          state={state}
          spectate={spectate}
          loading={!data || loading}
        />
      )}
    </div>
  );
}
