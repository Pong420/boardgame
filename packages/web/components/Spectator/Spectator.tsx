import React from 'react';
import { SpectateState } from '@/services';
import { gameMetaMap } from '@/games';
import { MatchProvider } from '@/hooks/useMatch';
import { useGetMach } from '@/hooks/useGetMach';
import { Loading } from '../CenterText';
import { Preferences } from '../Preferences';
import { SpectatorHeader } from './SpectatorHeader';
import { SpectatorContent } from './SpectatorContent';
import styles from './Spectator.module.scss';

type Props = SpectateState;

export function Spectator(props: Props) {
  const { name, matchID } = props;
  const { gameName } = gameMetaMap[name];

  const [{ data }] = useGetMach({ name, matchID });

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
