import React, { useEffect, useState } from 'react';
import { GameMeta, Match } from '@/typings';
import { LobbyHeader } from './LobbyHeader';
import { LobbyItem } from './LobbyItem';
import { getMatches, usePreferencesState } from '@/services';
import { defer, interval, empty } from 'rxjs';
import { repeatWhen, map, catchError } from 'rxjs/operators';

interface Props {
  meta: GameMeta;
}

export function Lobby({ meta }: Props) {
  const { name } = meta;
  const [state, setState] = useState<Match[]>([]);
  const { polling } = usePreferencesState();

  useEffect(() => {
    if (polling) {
      const subscription = defer(() => getMatches({ name }))
        .pipe(
          map(response => response.data.matches),
          catchError(() => empty()),
          repeatWhen(() => interval(5 * 1000))
        )
        .subscribe(setState);
      return () => subscription.unsubscribe();
    }
  }, [name, polling]);

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
