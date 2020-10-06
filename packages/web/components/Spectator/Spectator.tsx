import React, { useMemo } from 'react';
import router from 'next/router';
import { RxAsyncOptions, useRxAsync } from 'use-rx-hooks';
import { getMatch, SpectateState } from '@/services';
import { ApiError, Schema$Match } from '@/typings';
import { gameMetaMap } from '@/games';
import { Toaster } from '@/utils/toaster';
import { MatchProvider } from '@/hooks/useMatch';
import { Loading } from '../Match';
import { SpectatorHeader } from './SpectatorHeader';
import { SpectatorContent } from './SpectatorContent';
import { Preferences } from '../Preferences';
import styles from './Spectator.module.scss';

type Props = SpectateState;

export function Spectator(props: Props) {
  const { name, matchID } = props;
  const { gameName } = gameMetaMap[name];
  const { request, options } = useMemo(() => {
    const options: RxAsyncOptions<Schema$Match> = {
      onFailure: (error: ApiError) => {
        router.push('/');
        Toaster.apiError('Get Match Failure', error);
      }
    };
    const request = () => getMatch({ name, matchID }).then(res => res.data);
    return {
      options,
      request
    };
  }, [name, matchID]);

  const [{ data }] = useRxAsync(request, options);

  if (!data || !data.setupData) {
    return <Loading />;
  }

  return (
    <MatchProvider>
      <div className={styles['spectator']}>
        <SpectatorHeader
          name={name}
          title={[gameName, data.setupData.matchName]
            .filter(Boolean)
            .join(' - ')}
        >
          <Preferences disablePlayerName />
        </SpectatorHeader>
        <SpectatorContent {...props} />
      </div>
    </MatchProvider>
  );
}
