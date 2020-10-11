import React from 'react';
import { gameMetaMap } from '@/games';
import {
  LocalMatchState,
  BotMatchState,
  isMatchState,
  gotoMatch
} from '@/services';
import { ButtonPopover } from '../ButtonPopover';
import { Preferences } from '../Preferences';
import { MatchHeader } from './MatchHeader';
import { MatchContent } from './MatchContent';
import styles from './Match.module.scss';

interface Props {
  state: LocalMatchState | BotMatchState;
}

export function LocalMatch({ state }: Props) {
  const meta = gameMetaMap[state.name];

  return (
    <div className={styles['match']}>
      <MatchHeader
        title={[meta.gameName, isMatchState(state, 'bot') ? 'Bot' : 'Local']
          .filter(Boolean)
          .join(' - ')}
      >
        <ButtonPopover
          icon="refresh"
          content="Play again"
          minimal
          onClick={() => gotoMatch({ ...state, matchID: String(+new Date()) })}
        />
        <Preferences disablePlayerName />
      </MatchHeader>
      <MatchContent state={state} />
    </div>
  );
}
