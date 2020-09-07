export interface Storage<T extends {}> {
  get(): T;
  save(value: T): void;
}

function createStorage<T>(
  storage: typeof localStorage | typeof sessionStorage
) {
  return (key: string, defaultValue: T): Storage<T> => {
    let value = (storage.getItem(key) || defaultValue) as T;

    function get(): T {
      return value;
    }

    function save(newValue: T) {
      value = newValue;
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch (error) {}
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
) => Storage<T> = createStorage(localStorage);

export const createSessionStorage: <T>(
  key: string,
  defaultValue: T
) => Storage<T> = createStorage(sessionStorage);
