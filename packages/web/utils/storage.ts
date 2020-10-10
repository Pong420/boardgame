import { JSONParse } from './JSONParse';

export interface Storage<T> {
  key: string;
  get(): T;
  save(value: T): void;
}

type WebStorage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;

function mixStorage(key: string, storage: WebStorage): WebStorage {
  const baseStorage = createStorage<Record<string, unknown>>(storage)(key, {});
  return {
    getItem: key => JSON.stringify(baseStorage.get()[key]),
    setItem: (key, value) =>
      baseStorage.save({ ...baseStorage.get(), [key]: JSONParse(value, null) })
  };
}

function createStorage<T>(storage?: WebStorage) {
  const _storage = storage as WebStorage;

  return (key: string, defaultValue: T) => {
    class _Storage<T> implements Storage<T> {
      key = key;

      constructor(private value: T) {}

      get() {
        if (typeof _storage !== 'undefined') {
          this.value = JSONParse<T>(_storage.getItem(key) || '', this.value);
        }
        return this.value;
      }

      save(newValue: T) {
        if (typeof _storage !== 'undefined') {
          _storage.setItem(key, JSON.stringify(newValue));
        }
        this.value = newValue;
      }
    }

    return new _Storage(defaultValue);
  };
}

export function storageSupport() {
  const mod = 'BOARDGAME_TEST_STORAGE';
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    }
  } catch (e) {}

  return false;
}

export const BOARDGAME_STORAGE = 'BOARDGAME_STORAGE';

export const createBoardgameStorage: <T>(
  key: string,
  defaultValue: T
) => Storage<T> = createStorage(
  !storageSupport() || typeof localStorage === 'undefined'
    ? undefined
    : mixStorage('BOARDGAME_STORAGE', localStorage)
);

export const createLocalStorage: <T>(
  key: string,
  defaultValue: T
) => Storage<T> = createStorage(
  !storageSupport() || typeof localStorage === 'undefined'
    ? undefined
    : localStorage
);

export const createSessionStorage: <T>(
  key: string,
  defaultValue: T
) => Storage<T> = createStorage(
  !storageSupport() || typeof sessionStorage === 'undefined'
    ? undefined
    : sessionStorage
);
