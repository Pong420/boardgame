import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import {
  gotoMatch,
  joinMatch,
  leaveMatch,
  matchStorage,
  MultiMatchState,
  playAgain
} from '@/services';
import { Toaster } from '@/utils/toaster';
import { ButtonPopover, ButtonPopoverProps } from './ButtonPopover';

interface Props extends ButtonPopoverProps {}

const request = async (): Promise<MultiMatchState> => {
  const state = matchStorage.get();
  if (state) {
    const again = await playAgain(state);
    const { nextMatchID } = again.data;
    const join = await joinMatch({ ...state, matchID: nextMatchID });

    leaveMatch(state).catch(error =>
      console.warn('Leave match failure', error)
    );

    return {
      ...state,
      matchID: nextMatchID,
      credentials: join.data.playerCredentials
    };
  }

  throw new Error('state not found');
};

function onSuccess(state: MultiMatchState) {
  matchStorage.save(state);
  gotoMatch(state);
}

const onFailure = Toaster.apiError.bind(Toaster, 'Play Again Failure');

export function PlayAgain(props: Props) {
  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure
  });

  return <ButtonPopover {...props} loading={loading} onClick={fetch} />;
}
