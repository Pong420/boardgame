import { navigate } from 'gatsby';
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
import isEqual from 'lodash/isEqual';

export interface PlayerState {
  name: string;
  matchID: string;
  playerID: string;
  credentials: string;
}

export const gotoMatch = (state: PlayerState) => {
  return navigate(`/match/${state.name}`, { state, replace: true });
};

export const gotoSpectate = ({
  name,
  matchID
}: Pick<PlayerState, 'name' | 'matchID'>) => {
  return navigate(`/spectate/${name}/${matchID}`);
};

export const matchStorage = createLocalStorage<PlayerState | null>(
  'BOARDGAME_PLAYER',
  null
);

export function leaveMatchAndRedirect(): undefined;
export function leaveMatchAndRedirect(state: PlayerState): Promise<void>;
export function leaveMatchAndRedirect(
  state?: PlayerState | null
): Promise<any> | undefined {
  matchStorage.save(null);

  if (state) {
    navigate(`/lobby/${state.name}/`);

    return defer(() => leaveMatch(state))
      .pipe(
        retryWhen(error$ =>
          error$.pipe(
            switchMap((error, index) =>
              index < 3 ? timer(1000) : throwError(error)
            )
          )
        )
      )
      .toPromise();
  }

  navigate(`/`);
}

const getState = (payload: string | null): PlayerState | null => {
  let state = payload
    ? JSONParse<(PlayerState & { key: string }) | null>(payload)
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
