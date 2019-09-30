/// <reference types="react-scripts" />

declare module 'pokersolver';
declare module 'Poker.JS/release/poker.min.js';

declare module 'boardgame.io/core';
declare module 'boardgame.io/react';
declare module 'boardgame.io/plugins';
declare module 'boardgame.io/server';

declare module '*.png';
declare module '*.jpg';
declare module '*.svg' {
  export const ReactComponent: SvgrComponent;
}

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

declare interface Window {
  Poker: {
    getCardData(height: number, suit: string, point: string): string;
    getBackImage(
      height: number,
      frontColor: string,
      backColor: string
    ): HTMLImageElement;
    getBackCanvas(
      height: number,
      frontColor: string,
      backColor: string
    ): HTMLCanvasElement;
  };
}

// https://codesandbox.io/s/github/piotrwitek/typesafe-actions-todo-app
declare interface NodeModule {
  hot?: { accept: (path?: string, callback?: () => void) => void };
}

declare interface System {
  import<T = any>(module: string): Promise<T>;
}
declare var System: System;

declare const process: any;
declare const require: any;
