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
import { Toaster } from '@/utils/toaster';
import { getPlayerName } from '../PlayerNameControl';

export interface Join {
  meta: GameMeta;
  matchName: string;
}

interface Props extends Join, Omit<Params$JoinMatch, 'playerName'> {}

const onFailure = Toaster.apiError.bind(Toaster, 'Join Match Failure');

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

function onSuccess(state: MultiMatchState) {
  matchStorage.save(state);
  gotoMatch(state);
}

export function JoinMatch(props: Props) {
  const [{ playerName }, updatePrefrences] = usePreferences();

  const [{ loading }, { fetch }] = useRxAsync(_joinMatch, {
    defer: true,
    onSuccess,
    onFailure
  });

  return (
    <Button
      text="Join"
      intent="primary"
      loading={loading}
      onClick={() =>
        (playerName
          ? Promise.resolve(playerName)
          : getPlayerName({ title: 'Player Name' }).then(playerName => {
              updatePrefrences(state => ({ ...state, playerName }));
              return playerName;
            })
        ).then(playerName => fetch({ ...props, playerName }))
      }
    />
  );
}
