import React, { useEffect, useCallback, useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { Toaster } from '@/utils/toaster';
import { gameMetaMap } from '@/games';
import { ApiError } from '@/typings';
import { useMatchState } from '@/hooks/useMatch';
import {
  getMatch,
  isMatchState,
  matchStorage,
  MultiMatchState,
  SpectateState
} from '@/services';
import { Chat } from '../Chat';
import { ShareButton } from '../ShareButton';
import { Preferences } from '../Preferences';
import { MatchHeader } from './MatchHeader';
import { MatchContent } from './MatchContent';
import styles from './Match.module.scss';

interface State {
  matchName: string;
  numPlayers: number;
  allowSpectate?: boolean;
}

interface Props {
  state: MultiMatchState | SpectateState;
}

const onFailure = (error: ApiError) => {
  const state = matchStorage.get();

  if (
    typeof error == 'object' &&
    'response' in error &&
    error.response?.status === 404 &&
    state
  ) {
    matchStorage.save(null);
  } else {
    Toaster.apiError('Get Match Failure', error);
  }

  router.push(state ? `/lobby/${state.name}` : `/`);
};

export function OnlineMatch({ state }: Props) {
  const { name, matchID } = state;
  const request = useCallback(async (): Promise<State> => {
    const { data } = await getMatch({ name, matchID });
    return data.setupData
      ? {
          ...data,
          ...data.setupData,
          numPlayers: data.players.length
        }
      : Promise.reject('Invalid match');
  }, [name, matchID]);

  const [{ data, loading }] = useRxAsync(request, { onFailure });
  const { matchName } = data || {};
  const { gameName } = gameMetaMap[state.name];
  const { started } = useMatchState(['started']);
  const [isGameover, setIsGameover] = useState<boolean | undefined>();

  useEffect(() => {
    setIsGameover(false);
  }, [matchID]);

  return (
    <div className={styles['match']}>
      <MatchHeader title={[gameName, matchName].filter(Boolean).join(' - ')}>
        {isMatchState(state, 'multi') && (
          <ShareButton
            gameName={gameName}
            name={state.name}
            matchID={state.matchID}
            playerName={state.playerName}
          />
        )}
        <Preferences disablePlayerName />
      </MatchHeader>
      {started && (
        <MatchContent
          state={state}
          loading={!data || loading}
          onGameover={() => setIsGameover(true)}
        />
      )}
      {isMatchState(state, 'multi') && (
        <Chat
          matchID={state.matchID}
          playerID={state.playerID}
          playerName={state.playerName}
          credentials={state.credentials}
          isGameover={isGameover}
        />
      )}
    </div>
  );
}
