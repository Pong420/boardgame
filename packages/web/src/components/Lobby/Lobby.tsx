import React, { useEffect, useState } from 'react';
import { defer, interval, empty } from 'rxjs';
import { repeatWhen, map, catchError, tap } from 'rxjs/operators';
import { GameMeta, Match } from '@/typings';
import { getMatches, usePreferencesState } from '@/services';
import { LobbyHeader } from './LobbyHeader';
import { LobbyItem } from './LobbyItem';
import { NoMatches } from './NoMatches';
import { Toaster } from '@/utils/toaster';

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
        catchError(error => {
          setLoading(false);
          !polling && Toaster.apiError('Get Matches Failure', error);
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
            <LobbyItem key={match.matchID} meta={meta} {...match} />
          ))}
        </div>
      ) : loading ? null : (
        <NoMatches meta={meta} />
      )}
    </div>
  );
}
