import React from 'react';
import { useRouter } from 'next/router';
import { Button, IButtonProps } from '@blueprintjs/core';
import { useRxAsync } from 'use-rx-hooks';
import { getMatch, gotoSpectate, getSpectateQuery } from '@/services';
import { Toaster } from '@/utils/toaster';
import { Param$GetMatch } from '@/typings';

interface Props extends IButtonProps {}

const request = async (params: Param$GetMatch) => {
  const response = await getMatch(params);
  if (response.data.nextMatchID) {
    await gotoSpectate({
      ...params,
      spectate: true,
      matchID: response.data.nextMatchID
    });
  } else {
    Toaster.failure({
      message: 'Next match have not started, you may try again later'
    });
  }
};

const onFailure = Toaster.apiError.bind(Toaster, 'Get Match Failure');

export function SpectateNext(props: Props) {
  const { query } = useRouter();
  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onFailure
  });

  return (
    <Button
      {...props}
      text="Next Match"
      loading={loading}
      onClick={() => fetch(getSpectateQuery(query))}
    />
  );
}
