import router from 'next/router';
import { AxiosError } from 'axios';
import { fromEvent, defer, empty, timer, throwError } from 'rxjs';
import {
  filter,
  exhaustMap,
  retryWhen,
  catchError,
  switchMap
} from 'rxjs/operators';
import { JSONParse } from '@/utils/JSONParse';
import { createLocalStorage } from '@/utils/storage';
import { leaveMatch } from './services';
import { pushHistoryState } from './historyState';
import isEqual from 'lodash/isEqual';

type Common = {
  name: string;
};

export type LocalMatchState = Common & {
  local: boolean;
  numPlayers: number;
};

export type MultiMatchState = Common & {
  matchID: string;
  playerID: string;
  credentials: string;
  playerName: string;
  unlisted: boolean;
};

export type SpectatorState = Common & {
  matchID: string;
  playerID?: string;
};

export type MatchState = LocalMatchState | MultiMatchState | SpectatorState;

export const gotoMatch = (state: MatchState) => {
  const pathname = `/match/${state.name}/`;
  pushHistoryState(state);
  return router.push({ pathname, query: state }, pathname);
};

export const gotoSpectate = ({ name, matchID, playerID }: SpectatorState) => {
  return router.push(`/spectate/${name}/${matchID}/${playerID || ''}`);
};

export const matchStorage = createLocalStorage<MultiMatchState | null>(
  'BOARDGAME_MATCH_STATE',
  null
);

export function leaveMatchAndRedirect(): undefined;
export function leaveMatchAndRedirect(
  state: MultiMatchState | null
): Promise<void>;
export function leaveMatchAndRedirect(
  state?: MultiMatchState | null
): Promise<any> | undefined {
  const leave = () => {
    const path = router.query?.name ? `/lobby/${router.query.name}` : '/';
    matchStorage.save(null);
    return router.push(path);
  };

  if (state) {
    return defer(() => leaveMatch(state))
      .pipe(
        retryWhen(error$ =>
          error$.pipe(
            switchMap((error: AxiosError, index) => {
              if (error.response?.status === 403) {
                return leave();
              }
              return index >= 3 ? throwError(error) : timer(1000);
            })
          )
        ),
        catchError((error: AxiosError) =>
          error.response?.status === 403 ? leave() : throwError(error)
        )
      )
      .toPromise();
  }

  return leave();
}

// leave match if user try to delete the matchStorage
if (typeof window !== 'undefined') {
  const parse = (payload: string | null): MultiMatchState | null => {
    const state = payload
      ? JSONParse<(MultiMatchState & { key: string }) | null>(payload)
      : undefined;
    if (state) {
      const { key, ...rest } = state;
      return rest;
    }
    return null;
  };

  fromEvent<StorageEvent>(window, 'storage')
    .pipe(
      filter(event => event.key === matchStorage.key),
      exhaustMap(event => {
        const oldState = parse(event.oldValue);
        const newState = parse(event.newValue);

        return oldState && !isEqual(oldState, newState)
          ? leaveMatchAndRedirect(oldState)
          : empty();
      }),
      catchError(() => empty())
    )
    .subscribe();
}
