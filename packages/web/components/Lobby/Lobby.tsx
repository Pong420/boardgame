import React, { useEffect, useRef, useState } from 'react';
import { defer, empty, Subject, timer } from 'rxjs';
import {
  map,
  catchError,
  tap,
  exhaustMap,
  startWith,
  switchMap
} from 'rxjs/operators';
import { GameMeta, Match } from '@/typings';
import { getMatches, usePreferencesState } from '@/services';
import { Toaster } from '@/utils/toaster';
import { ButtonPopover } from '../ButtonPopover';
import { LobbyHeader } from './LobbyHeader';
import { LobbyItem } from './LobbyItem';
import { NoMatches } from './NoMatches';
import { CreateMatch } from './CreateMatch';
import styles from './Lobby.module.scss';

interface Props extends GameMeta {}

export function Lobby(meta: Props) {
  const { name, gameName } = meta;
  const [state, setState] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { polling } = usePreferencesState();
  const subject = useRef(new Subject());

  useEffect(() => {
    if (polling) {
      const subscription = subject.current
        .pipe(
          startWith(-1),
          switchMap(() => timer(5 * 1000))
        )
        .subscribe(idx => subject.current.next(idx));
      return () => subscription.unsubscribe();
    }
  }, [polling]);

  useEffect(() => {
    const subscription = subject.current
      .pipe(
        startWith(null),
        map(value => typeof value !== 'number'),
        exhaustMap(refresh => {
          refresh && setLoading(true);
          return defer(() => {
            const date = new Date();
            date.setHours(date.getHours() - 1);
            return getMatches({
              name,
              isGameover: false,
              updatedAfter: date.getTime()
            });
          }).pipe(
            map(response => response.data.matches),
            tap(() => setLoading(false)),
            catchError(error => {
              if (refresh) {
                setLoading(false);
                Toaster.apiError('Get Matches Failure', error);
              }
              return empty();
            })
          );
        })
      )
      .subscribe(setState);

    return () => subscription.unsubscribe();
  }, [name]);

  return (
    <div className={styles['lobby']}>
      <LobbyHeader title={`Lobby - ${gameName}`}>
        <CreateMatch meta={meta} icon="plus" content="Create Match" minimal />
        <ButtonPopover
          minimal
          icon="refresh"
          content="Refresh"
          loading={loading}
          onClick={() => subject.current.next()}
        />
      </LobbyHeader>
      {state.length ? (
        <div className={styles['lobby-content']}>
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
