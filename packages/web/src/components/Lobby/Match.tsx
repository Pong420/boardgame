import React from 'react';
import { Card, Button } from '@blueprintjs/core';
import { useMatch } from './MatchesProvider';
import { JoinMatch } from './JoinMatch';
import { Player } from '@/typings';

interface Props {
  name: string;
  matchID: string;
}

export function Match({ name, matchID }: Props) {
  const { setupData, updatedAt, players } = useMatch(matchID);
  const [nextPlayers, playerJoined] = players.reduce(
    (result, p) => {
      result[typeof p.name === 'undefined' ? 0 : 1].push(p);
      return result;
    },
    [[], []] as [Player[], Player[]]
  );

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
            {nextPlayers.length ? (
              <JoinMatch
                name={name}
                matchID={matchID}
                playerID={String(nextPlayers[0]?.id)}
              />
            ) : (
              <Button text="Spectate" />
            )}
          </div>
        </div>
      </Card>
    );
  }

  return <Card className="match">Invlid Match</Card>;
}
