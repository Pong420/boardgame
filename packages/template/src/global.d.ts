declare module '*.scss';

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

declare interface System {
  import<T = any>(module: string): Promise<T>;
}

declare const process: any;
declare const require: any;
