import React from 'react';
import { Card } from '@blueprintjs/core';
import { JoinMatch } from './JoinMatch';
import { Match } from '../../typings';

interface Props extends Match {
  name: string;
}

export function MatchItem({ name, matchID, setupData, players }: Props) {
  const matchName = setupData?.matchName || matchID;
  const nextPlayer = players.find(player => !player.hasOwnProperty('name'));

  if (setupData) {
    return (
      <Card className="match-item" elevation={2}>
        <div className="match-item-name">{matchName}</div>
        <div className="match-item-footer">
          {nextPlayer && (
            <JoinMatch
              name={name}
              matchID={matchID}
              playerID={String(nextPlayer.id)}
            />
          )}
        </div>
      </Card>
    );
  }

  return null;
}
