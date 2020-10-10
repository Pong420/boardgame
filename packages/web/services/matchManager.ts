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
import { createBoardgameStorage, BOARDGAME_STORAGE } from '@/utils/storage';
import { pushHistoryState } from '@/utils/historyState';
import { gameMetaMap } from '@/games';
import { leaveMatch } from './services';
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

export type SpectateState = Common & {
  matchID: string;
  playerID?: string;
  isSpectator: boolean;
};

export type MatchState = LocalMatchState | MultiMatchState | SpectateState;

export function isMatchState(s: unknown, type: 'local'): s is LocalMatchState;
export function isMatchState(s: unknown, type: 'multi'): s is MultiMatchState;
export function isMatchState(s: unknown, type: 'spectate'): s is SpectateState;
export function isMatchState(state: unknown, type: string) {
  if (state && typeof state === 'object') {
    switch (type) {
      case 'local':
        return 'local' in state;
      case 'multi':
        return 'playerName' in state;
      case 'spectate':
        return 'isSpectator' in state;
    }
  }
}

export const gotoMatch = (state: MatchState) => {
  const pathname = `/match/${state.name}/`;
  pushHistoryState(state);
  return router.push({ pathname, query: state }, pathname);
};

export const gotoSpectate = ({ name, matchID, playerID }: SpectateState) => {
  return router.push(`/spectate/${name}/${matchID}/${playerID || ''}`);
};

export const matchStorage = createBoardgameStorage<MultiMatchState | null>(
  'BOARDGAME_MATCH_STATE',
  null
);

export const getSpectateQuery = (
  query: typeof router['query']
): Required<SpectateState> => {
  const slug = Array.isArray(query.slug) ? query.slug : [];
  const [name = '', matchID = '', playerID = ''] = slug;
  return { name, matchID, playerID, isSpectator: true };
};

export function leaveMatchAndRedirect(): undefined;
export function leaveMatchAndRedirect(
  state: MultiMatchState | null
): Promise<void>;
export function leaveMatchAndRedirect(
  state?: MultiMatchState | null
): Promise<any> | undefined {
  const leave = () => {
    const name = (router.query?.slug || [])[0] || router.query?.name;
    const path =
      typeof name === 'string' && gameMetaMap[name] ? `/lobby/${name}` : '/';
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
        ),
        switchMap(() => leave())
      )
      .toPromise();
  }

  return leave();
}

// leave match if user try to delete the matchStorage
if (typeof window !== 'undefined') {
  const parse = (base: string | null): MultiMatchState | null => {
    const payload =
      base && JSONParse<Record<string, string>>(base, {})[matchStorage.key];
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
      filter(event => event.key === BOARDGAME_STORAGE),
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
