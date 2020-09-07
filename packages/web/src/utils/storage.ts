import { JSONParse } from './JSONParse';

export interface Storage<T extends {}> {
  get(): T;
  save(value: T): void;
}

type WebStorage = typeof localStorage | typeof sessionStorage;

function createStorage<T>(storage?: WebStorage) {
  const _storage = storage!;

  return (key: string, defaultValue: T): Storage<T> => {
    function get(): T {
      const val = _storage.getItem(key);
      return (val && JSONParse(val)) || defaultValue;
    }

    function save(value: T) {
      _storage.setItem(key, JSON.stringify(value));
    }

    return {
      get,
      save
    };
  };
}

export const createLocalStorage: <T>(
  key: string,
  defaultValue: T
) => Storage<T> = createStorage(
  typeof localStorage === 'undefined' ? undefined : localStorage
);

export const createSessionStorage: <T>(
  key: string,
  defaultValue: T
) => Storage<T> = createStorage(
  typeof sessionStorage === 'undefined' ? undefined : sessionStorage
);
