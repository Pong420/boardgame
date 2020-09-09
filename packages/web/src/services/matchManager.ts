import { navigate } from 'gatsby';
import { AxiosError } from 'axios';
import { fromEvent, defer, empty, timer, throwError } from 'rxjs';
import {
  filter,
  exhaustMap,
  retryWhen,
  catchError,
  switchMap,
  tap
} from 'rxjs/operators';
import { JSONParse } from '@/utils/JSONParse';
import { createLocalStorage } from '@/utils/storage';
import { leaveMatch } from './services';
import isEqual from 'lodash/isEqual';

interface Common {
  name: string;
}

export interface LocalMatchState extends Common {
  local: boolean;
  numPlayers: number;
  gameName: string;
}

export interface MultiMatchState extends Common {
  matchID: string;
  playerID: string;
  credentials: string;
}

export interface SpectatorState extends Common {
  matchID: string;
  playerID?: string;
}

export type MatchState = LocalMatchState | MultiMatchState | SpectatorState;

export const gotoMatch = (state: MatchState) => {
  return navigate(`/match/${state.name}/`, { state, replace: true });
};

export const gotoSpectate = ({ name, matchID }: SpectatorState) => {
  return navigate(`/spectate/${name}/${matchID}/`);
};

export const matchStorage = createLocalStorage<MultiMatchState | null>(
  'BOARDGAME_MATCH_STATE',
  null
);

export function leaveMatchAndRedirect(): undefined;
export function leaveMatchAndRedirect(state: MultiMatchState): Promise<void>;
export function leaveMatchAndRedirect(
  state?: MultiMatchState | null
): Promise<any> | undefined {
  if (state) {
    return defer(() => leaveMatch(state))
      .pipe(
        retryWhen(error$ =>
          error$.pipe(
            switchMap((error: AxiosError, index) =>
              error.response?.status === 403 || index >= 3
                ? throwError(error)
                : timer(1000)
            )
          )
        ),
        tap(() => {
          navigate(`/lobby/${state.name}/`);
          matchStorage.save(null);
        })
      )
      .toPromise();
  }

  navigate(`/`);
  matchStorage.save(null);
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
