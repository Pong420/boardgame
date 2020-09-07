import { navigate } from 'gatsby';
import { fromEvent, defer, empty } from 'rxjs';
import {
  filter,
  exhaustMap,
  tap,
  retryWhen,
  delay,
  catchError
} from 'rxjs/operators';
import { JSONParse } from '@/utils/JSONParse';
import { createLocalStorage } from '@/utils/storage';
import { leaveMatch } from './services';

const Key = 'BOARDGAME_PLAYER';

export interface PlayerState {
  name: string;
  matchID: string;
  playerID: string;
  credentials: string;
}

export const gotoMatch = (state: PlayerState) => {
  return navigate(`/match/${state.name}`, { state, replace: true });
};

export const matchStorage = createLocalStorage<PlayerState | null>(Key, null);

const pointerEvents = (value: string) => {
  document.documentElement.style.pointerEvents = value;
};

export const confirmLeaveMatch = () => {
  const state = matchStorage.get();
  if (state) {
    return new Promise((resolve, reject) =>
      leaveMatch(state)
        .then(() => {
          matchStorage.save(null);
          navigate(`/lobby/${state.name}/`);
          resolve();
        })
        .catch(reject)
    );
  }
  throw new Error('You have not join any match');
};

if (typeof window !== 'undefined') {
  fromEvent<StorageEvent>(window, 'storage')
    .pipe(
      filter(event => event.key === Key),
      exhaustMap(event => {
        const oldState =
          event.oldValue && JSONParse<PlayerState | null>(event.oldValue);
        return oldState
          ? defer(() => leaveMatch(oldState)).pipe(
              tap(() => pointerEvents('none')),
              retryWhen(error$ => error$.pipe(delay(1000)))
            )
          : empty();
      }),
      catchError(() => empty())
    )
    .subscribe(() => {
      pointerEvents('auto');
      matchStorage.save(null);
      navigate('/');
    });
}
