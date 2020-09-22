export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export type DateRange = [string, string];

export enum Order {
  ASC,
  DESC
}

export interface Pagination<T = any> {
  page?: number;
  size?: number;
  sort?: string | Record<keyof T, Order>;
}

export interface Search {
  search?: string;
}

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
  [K in Exclude<keyof T, keyof P>]: unknown;
};

export * from './match';
