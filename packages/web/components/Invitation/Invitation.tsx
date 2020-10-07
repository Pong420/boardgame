import React, { ReactNode } from 'react';
import { gameMetaMap } from '@/games';
import { useGetMach } from '@/hooks/useGetMach';
import { JoinMatch } from '../Lobby/JoinMatch';
import { Spectate } from '../Spectate';
import styles from './Invitation.module.scss';

interface Props {
  name: string;
  matchID: string;
}

const Text: React.FC = props => <div {...props} className={styles['text']} />;

export function Invitation({ name, matchID }: Props) {
  const [{ data: match, loading }] = useGetMach({ name, matchID });

  let content: ReactNode;

  if (match) {
    const meta = gameMetaMap[match.gameName];
    const { id: nextPlayerID } =
      match.players.find(p => typeof p.name === 'undefined') || {};

    if (nextPlayerID) {
      content = (
        <div>
          <Text>Let's play boardgame</Text>
          <JoinMatch
            name={match.gameName}
            matchID={match.matchID}
            unlisted={match.unlisted}
            playerID={String(nextPlayerID)}
          />
        </div>
      );
    } else {
      content = (
        <div>
          <Text>The match already started</Text>
          <Spectate
            name={match.gameName}
            matchID={match.matchID}
            players={match.players}
            allow={!!match.setupData?.allowSpectate}
            type={meta.spectate}
            text="Spectate"
          />
        </div>
      );
    }
  }

  if (loading) {
    content = <Text>loading...</Text>;
  }

  return <div className={styles['invitation']}>{content}</div>;
}
