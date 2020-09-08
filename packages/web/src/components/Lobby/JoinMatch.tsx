import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import {
  joinMatch,
  gotoMatch,
  usePreferences,
  matchStorage,
  MultiMatchState
} from '@/services';
import { Params$JoinMatch, GameMeta } from '@/typings';
import { getPlayerName } from '../PlayerNameControl';

export interface Join {
  meta: GameMeta;
  matchName: string;
}

interface Props extends Join, Omit<Params$JoinMatch, 'playerName'> {}

function _joinMatch({ meta, matchName, ...params }: Join & Params$JoinMatch) {
  return joinMatch(params).then<MultiMatchState>(res => ({
    matchName,
    gameMeta: meta,
    name: params.name,
    matchID: params.matchID,
    playerID: params.playerID,
    credentials: res.data.playerCredentials
  }));
}

export function JoinMatch({ meta, ...params }: Props) {
  const [{ playerName }, updatePrefrences] = usePreferences();

  const [{ loading }, { fetch }] = useRxAsync(_joinMatch, {
    defer: true,
    onSuccess: gotoMatch
  });

  function handleJoinMatch() {
    if (playerName) {
      fetch({ ...params, meta, playerName });
    } else {
      getPlayerName({ title: 'Player Name' }).then(playerName => {
        updatePrefrences(state => ({ ...state, playerName }));
        return _joinMatch({ ...params, meta, playerName }).then(state => {
          matchStorage.save(state);
          gotoMatch(state);
        });
      });
    }
  }

  return (
    <Button
      text="Join"
      intent="primary"
      loading={loading}
      onClick={handleJoinMatch}
    />
  );
}
