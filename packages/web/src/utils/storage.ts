import { JSONParse } from './JSONParse';

export interface Storage<T> {
  get(): T;
  save(value: T): void;
}

type WebStorage = typeof localStorage | typeof sessionStorage;

function createStorage<T>(storage?: WebStorage) {
  const _storage = storage!;

  return (key: string, defaultValue: T): Storage<T> => {
    class _Storage<T> implements Storage<T> {
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
