import React, { useCallback } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { Toaster } from '@/utils/toaster';
import { gameMetaMap } from '@/games';
import { ApiError, Param$GetMatch } from '@/typings';
import { ChatProvider, useChatState } from '@/hooks/useChat';
import { MatchState, getMatch, matchStorage, isMatchState } from '@/services';
import { Chat } from '../Chat';
import { ShareButton } from '../ShareButton';
import { Preferences } from '../Preferences';
import { MatchHeader } from './MatchHeader';
import { MatchContent } from './MatchContent';
import styles from './Match.module.scss';
import { CenterText } from './CenterText';

interface State {
  matchName: string;
  numPlayers: number;
  allowSpectate?: boolean;
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

function MatchComponent(state: MatchState) {
  const { name, matchID }: Partial<Param$GetMatch> = isMatchState(
    state,
    'local'
  )
    ? {}
    : { name: state.name, matchID: state.matchID };

  const _getMatch = useCallback(async (): Promise<State> => {
    if (name && matchID) {
      const { data } = await getMatch({ name, matchID });

      return data.setupData
        ? {
            ...data,
            ...data.setupData,
            numPlayers: data.players.length
          }
        : Promise.reject('Invalid match');
    }
    return { matchName: 'Local', numPlayers: 0 };
  }, [name, matchID]);

  const [{ data, loading }] = useRxAsync(_getMatch, { onFailure });
  const { matchName, allowSpectate } = data || {};
  const { gameName } = gameMetaMap[state.name];
  const { started } = useChatState(['started']);

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
      {isMatchState(state, 'multi') && data && (
        <Chat
          matchID={state.matchID}
          playerID={state.playerID}
          playerName={state.playerName}
          credentials={state.credentials}
        />
      )}
      {isMatchState(state, 'spectate') && !started && (
        <CenterText text="Waiting for match start" />
      )}
      {(isMatchState(state, 'local') || started) && (
        <MatchContent
          state={state}
          loading={!data || loading}
          isSpectator={allowSpectate}
        />
      )}
    </div>
  );
}

export function Match(state: MatchState) {
  return (
    <ChatProvider>
      <MatchComponent {...state} />
    </ChatProvider>
  );
}
