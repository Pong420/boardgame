import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import {
  joinMatch,
  gotoMatch,
  PlayerState,
  usePreferences,
  matchStorage
} from '@/services';
import { Params$JoinMatch } from '@/typings';
import { getPlayerName } from '../PlayerNameControl';

interface Props extends Omit<Params$JoinMatch, 'playerName'> {}

function _joinMatch(params: Params$JoinMatch) {
  return joinMatch(params).then<PlayerState>(res => ({
    ...params,
    credentials: res.data.playerCredentials
  }));
}

export function JoinMatch(params: Props) {
  const [{ playerName }, updatePrefrences] = usePreferences();

  const [{ loading }, { fetch }] = useRxAsync(_joinMatch, {
    defer: true,
    onSuccess: gotoMatch
  });

  function handleJoinMatch() {
    if (playerName) {
      fetch({ ...params, playerName });
    } else {
      getPlayerName({ title: 'Player Name' }).then(playerName => {
        updatePrefrences(state => ({ ...state, playerName }));
        return _joinMatch({ playerName, ...params }).then(state => {
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
