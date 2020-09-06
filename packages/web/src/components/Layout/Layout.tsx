import React, { ReactNode } from 'react';
import { GameMetaProvider } from '@/store/gameMeta';
import { RouteComponentProps } from '@/typings';
import { SEO } from '../SEO';
import GameList from '../GameList';

interface LayoutProps extends RouteComponentProps {
  children?: ReactNode;
}

export const Layout = ({ children, path }: LayoutProps) => {
  return (
    <GameMetaProvider>
      <SEO />
      <div className="layout">
        {(path === '/' || path.startsWith('/lobby/')) && <GameList />}
        {children}
      </div>
    </GameMetaProvider>
  );
};
