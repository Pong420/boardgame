import React from 'react';
import { Card } from '@blueprintjs/core';
import { Player, Match, GameMeta } from '@/typings';
import { JoinMatch } from './JoinMatch';
import { Spectate } from './Spectate';
import styles from './Lobby.module.scss';

interface Props extends Match {
  meta: GameMeta;
}

const dataFormat = (value: number): string => {
  const d = new Date(value);
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(n => String(n).padStart(2, '0'))
    .join(':');
};

export function LobbyItem({
  meta,
  matchID,
  setupData,
  updatedAt,
  players,
  unlisted
}: Props) {
  const [nextPlayers, playerJoined] = players.reduce(
    (result, p) => {
      result[typeof p.name === 'undefined' ? 0 : 1].push(p);
      return result;
    },
    [[], []] as [Player[], Player[]]
  );
  const numPlayers = players.length;
  const { name, spectate: spectateType } = meta;

  if (setupData) {
    const { matchName, description, spectate } = setupData;
    return (
      <Card className={styles['lobby-item']} elevation={1}>
        <div className={styles['lobby-item-header']}>
          <div className={styles['lobby-item-name']}>
            {matchName.slice(0, 10)}
          </div>
          <div>
            {playerJoined.length} / {numPlayers}
          </div>
        </div>
        <div className={styles['lobby-item-description']}>
          {description?.slice(0, 50)}
        </div>
        <div className={styles['lobby-item-footer']}>
          <div>{dataFormat(updatedAt)}</div>
          <div>
            {nextPlayers.length ? (
              <JoinMatch
                name={name}
                matchID={matchID}
                unlisted={unlisted}
                playerID={String(nextPlayers[0]?.id)}
              />
            ) : (
              <Spectate
                name={name}
                matchID={matchID}
                players={players}
                allow={spectate}
                type={spectateType}
              />
            )}
          </div>
        </div>
      </Card>
    );
  }

  return <Card className={styles['lobby-item']}>Invlid Match</Card>;
}
