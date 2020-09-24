// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
export type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

export type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export type SubType<Base, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>;

export type ValueOf<T> = T[keyof T];

export type DTOExcluded<
  T extends Record<string, any>,
  P extends Record<string, any> = Record<string, any>
> = {
  [K in Exclude<keyof T, keyof P>]?: unknown;
};

export * from './match';
export * from './chat';
