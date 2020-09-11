import React, { useEffect, useRef, useState } from 'react';
import { defer, empty, Subject, merge, timer } from 'rxjs';
import { map, catchError, tap, exhaustMap } from 'rxjs/operators';
import { GameMeta, Match } from '@/typings';
import { getMatches, usePreferencesState } from '@/services';
import { Toaster } from '@/utils/toaster';
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
  const subject = useRef(new Subject());

  useEffect(() => {
    const subscription = merge(
      subject.current,
      polling ? timer(0, 5 * 1000) : timer(0)
    )
      .pipe(
        tap(() => setLoading(true)),
        exhaustMap(value =>
          defer(() => {
            const date = new Date();
            date.setHours(date.getHours() - 1);
            return getMatches({
              name,
              isGameover: false,
              updatedAfter: date.getTime()
            });
          }).pipe(
            map(response => response.data.matches),
            catchError(error => {
              setLoading(false);

              // if the request is not trigger by timer
              if (typeof value !== 'number') {
                Toaster.apiError('Get Matches Failure', error);
              }
              return empty();
            })
          )
        )
      )
      .subscribe(state => {
        setState(state);
        setLoading(false);
      });
    return () => subscription.unsubscribe();
  }, [name, polling]);

  return (
    <div className="lobby">
      <LobbyHeader
        meta={meta}
        updating={loading}
        onRefresh={() => subject.current.next()}
      />
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
