import { HistoryLocation } from '@reach/router';

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
  version: string;
  name: string;
  gameName: string;
  icon: string;
  author: string;
  numOfPlayers: number[];
  description?: string;
}

export * from './services';
