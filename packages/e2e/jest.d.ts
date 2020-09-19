import * as customMatchers from './matchers';

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

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : void;

type Result = jest.CustomMatcherResult | Promise<jest.CustomMatcherResult>;

type CustomMatchers = SubType<
  typeof customMatchers,
  (...args: any[]) => Result
>;

type T1 = OmitFirstArg<CustomMatchers['goto']>;

type NormalizeCustomMatchers = {
  [K in keyof CustomMatchers]: OmitFirstArg<CustomMatchers[K]>;
};

declare global {
  declare namespace jest {
    // eslint-disable-next-line
    interface Matchers<R = any, T = any> extends NormalizeCustomMatchers {}
  }

  const testUrl: string;
  const snapshotsDir: string;
}

declare module 'puppeteer' {
  // eslint-disable-next-line
  export interface Page {
    waitForTimeout(duration: number): Promise<void>;
  }
}

export {};
