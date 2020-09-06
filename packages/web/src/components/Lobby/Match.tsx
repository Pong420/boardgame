import React from 'react';
import { Card, Button } from '@blueprintjs/core';
import { useMatch } from './MatchesProvider';

interface Props {
  matchID: string;
}

export function Match({ matchID }: Props) {
  const { setupData, updatedAt, players } = useMatch(matchID);
  const playerJoined = players.filter(p => typeof p.name !== 'undefined');

  if (setupData) {
    const { matchName, description, numOfPlayers } = setupData;
    return (
      <Card className="match" elevation={1}>
        <div className="match-header">
          <div className="match-name">{matchName.slice(0, 10)}</div>
          <div>
            {playerJoined.length} / {numOfPlayers}
          </div>
        </div>
        <div className="match-description">{description?.slice(0, 50)}</div>
        <div className="match-footer">
          <div>
            {new Date(updatedAt)
              .toISOString()
              .replace(/T/, ' ')
              .replace(/\..*/, '')}
          </div>
          <div>
            <Button small intent="primary" text="Join" />
          </div>
        </div>
      </Card>
    );
  }

  return <Card className="match">Invlid Match</Card>;
}
