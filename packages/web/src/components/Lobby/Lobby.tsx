import React, { useEffect, useState } from 'react';
import { defer, interval, empty } from 'rxjs';
import { repeatWhen, map, catchError, tap } from 'rxjs/operators';
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
  const [loading, setLoading] = useState(true);
  const { polling } = usePreferencesState();

  useEffect(() => {
    const subscription = defer(() => getMatches({ name }))
      .pipe(
        tap(() => setLoading(true)),
        map(response => response.data.matches),
        catchError(() => {
          setLoading(false);
          return empty();
        }),
        repeatWhen(() => (polling ? interval(5 * 1000) : empty()))
      )
      .subscribe(state => {
        setState(state);
        setLoading(false);
      });
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
      ) : loading ? null : (
        <NoMatches
          name={name}
          gameName={meta.gameName}
          numPlayers={meta.numPlayers}
        />
      )}
    </div>
  );
}
