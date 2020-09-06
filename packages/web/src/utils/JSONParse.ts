export function JSONParse<T>(str: string, defaultValue: T): T;
export function JSONParse<T>(str: string, defaultValue?: T): T | undefined;
export function JSONParse<T>(str: string, defaultValue?: T) {
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    return defaultValue;
  }
}
