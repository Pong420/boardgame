import React, { useEffect, useState } from 'react';
import { GameMeta, Match } from '@/typings';
import { LobbyHeader } from './LobbyHeader';
import { LobbyItem } from './LobbyItem';
import { getMatches } from '@/services';
import { defer, interval } from 'rxjs';
import { repeatWhen, map } from 'rxjs/operators';

interface Props {
  meta: GameMeta;
}

export function Lobby({ meta }: Props) {
  const { name } = meta;
  const [state, setState] = useState<Match[]>([]);

  useEffect(() => {
    const subscription = defer(() => getMatches({ name }))
      .pipe(
        map(response => response.data.matches),
        repeatWhen(() => interval(5 * 1000))
      )
      .subscribe(setState);
    return () => subscription.unsubscribe();
  }, [name]);

  return (
    <div className="lobby">
      <LobbyHeader meta={meta} />
      <div className="lobby-content">
        {state.map(match => (
          <LobbyItem key={match.matchID} name={name} {...match} />
        ))}
      </div>
    </div>
  );
}
