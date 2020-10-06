import React, { useCallback } from 'react';
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

interface Props extends ButtonPopoverProps {
  onSuccess?: (state: MultiMatchState) => void;
}

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

const onFailure = Toaster.apiError.bind(Toaster, 'Play Again Failure');

export function PlayAgain({ onSuccess: _onSuccess, ...props }: Props) {
  const onSuccess = useCallback(
    (state: MultiMatchState) => {
      _onSuccess && _onSuccess(state);
      matchStorage.save(state);
      gotoMatch(state);
    },
    [_onSuccess]
  );
  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure
  });

  return <ButtonPopover {...props} loading={loading} onClick={fetch} />;
}
