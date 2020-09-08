import { navigate } from 'gatsby';
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
import { AxiosError } from 'axios';

export type LocalMatchState = {
  name: string;
  local: boolean;
  numPlayers: number;
};
export type MultiMatchState = {
  name: string;
  numPlayers: number;
  matchID: string;
  playerID: string;
  credentials: string;
};

export type MatchState = LocalMatchState | MultiMatchState;

export const gotoMatch = (state: MatchState) => {
  return navigate(`/match/${state.name}`, { state, replace: true });
};

export const gotoSpectate = ({
  name,
  matchID
}: Pick<MultiMatchState, 'name' | 'matchID'>) => {
  return navigate(`/spectate/${name}/${matchID}`);
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

const getState = (payload: string | null): MultiMatchState | null => {
  let state = payload
    ? JSONParse<(MultiMatchState & { key: string }) | null>(payload)
    : undefined;
  delete state?.key;
  return state || null;
};

if (typeof window !== 'undefined') {
  fromEvent<StorageEvent>(window, 'storage')
    .pipe(
      filter(event => event.key === matchStorage.key),
      exhaustMap(event => {
        const oldState = getState(event.oldValue);
        const newState = getState(event.newValue);

        return oldState && !isEqual(oldState, newState)
          ? leaveMatchAndRedirect(oldState)
          : empty();
      }),
      catchError(() => empty())
    )
    .subscribe();
}
