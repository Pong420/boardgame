import { HistoryLocation } from '@reach/router';
import { ReactNode } from 'react';

export interface RouteComponentProps<
  Data = any,
  Context = any,
  LocationState = {}
> {
  path: string;
  location: HistoryLocation & { state: LocationState };
  pageResources: {
    json: {
      pageContext: Context;
    };
    page: {
      componentChunkName: string;
      path: string;
      webpackCompilationHash: string;
    };
  };
  uri: string;
  pageContext: Context;
  pathContext: Context;
  data: Data;
}

export interface GameMeta {
  name: string;
  gameName: string;
  icon: ReactNode;
  author: string;
  numPlayers: number[];
  description?: string;
  spectate?: 'all-players' | 'single-player';
}

export * from './services';
