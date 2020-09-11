import React from 'react';
import { Button, IButtonProps } from '@blueprintjs/core';
import { useRxAsync } from 'use-rx-hooks';
import { gotoMatch, matchStorage, playAgain } from '@/services';
import { Toaster } from '@/utils/toaster';

interface Props extends IButtonProps {}

const request = () => {
  const state = matchStorage.get();
  return state
    ? playAgain(state).then(res => {
        const newState = { ...state, matchID: res.data.nextMatchID };
        matchStorage.save(newState);
        return gotoMatch(newState);
      })
    : Promise.reject('Some thing worng');
};

const onFailure = Toaster.apiError.bind(Toaster, 'Play Again Failure');

export function PlayAgain(props: Props) {
  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onFailure
  });
  return (
    <Button {...props} text="Play again" loading={loading} onClick={fetch} />
  );
}
