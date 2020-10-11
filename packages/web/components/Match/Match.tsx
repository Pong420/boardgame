import React from 'react';
import { MatchProvider } from '@/hooks/useMatch';
import { MatchState, isMatchState } from '@/services';
import { Redirect } from '../Redirect';
import { OnlineMatch } from './OnlineMatch';
import { LocalMatch } from './LocalMatch';

interface Props {
  state: MatchState;
}

export function Match({ state }: Props) {
  if (isMatchState(state, 'local') || isMatchState(state, 'bot')) {
    return <LocalMatch state={state} />;
  }

  if (isMatchState(state, 'multi') || isMatchState(state, 'spectate')) {
    return (
      <MatchProvider>
        <OnlineMatch state={state} />
      </MatchProvider>
    );
  }

  return <Redirect />;
}
