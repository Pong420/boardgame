import { ReactNode } from 'react';

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
