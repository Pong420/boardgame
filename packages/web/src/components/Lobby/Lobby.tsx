import React, { useEffect, useState } from 'react';
import { defer, interval, empty } from 'rxjs';
import { repeatWhen, map, catchError } from 'rxjs/operators';
import { GameMeta, Match } from '@/typings';
import { getMatches, usePreferencesState } from '@/services';
import { LobbyHeader } from './LobbyHeader';
import { LobbyItem } from './LobbyItem';
import { NoMatches } from './NoMatches';

interface Props {
  meta: GameMeta;
}

export function Lobby({ meta }: Props) {
  const { name } = meta;
  const [state, setState] = useState<Match[]>([]);
  const { polling } = usePreferencesState();

  useEffect(() => {
    const subscription = defer(() => getMatches({ name }))
      .pipe(
        map(response => response.data.matches),
        catchError(() => empty()),
        repeatWhen(() => (polling ? interval(5 * 1000) : empty()))
      )
      .subscribe(setState);
    return () => subscription.unsubscribe();
  }, [name, polling]);

  return (
    <div className="lobby">
      <LobbyHeader meta={meta} />
      {state.length ? (
        <div className="lobby-content">
          {state.map(match => (
            <LobbyItem key={match.matchID} name={name} {...match} />
          ))}
        </div>
      ) : (
        <NoMatches
          name={name}
          gameName={meta.gameName}
          numPlayers={meta.numPlayers}
        />
      )}
    </div>
  );
}
