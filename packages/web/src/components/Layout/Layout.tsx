import React, { ReactNode } from 'react';
import { RouteComponentProps } from '@/typings';
import { SEO } from '../SEO';
import { GameList } from '../GameList';
import { usePreferencesState, matchStorage, gotoMatch } from '@/services';

interface LayoutProps extends RouteComponentProps {
  children?: ReactNode;
}

export const Layout = ({ children, path }: LayoutProps) => {
  const { screenWidth } = usePreferencesState();

  if (!path.startsWith('/match')) {
    const match = matchStorage.get();
    if (match) {
      gotoMatch(match);
      return null;
    }
  }

  return (
    <>
      <SEO />
      <div
        className="layout"
        style={{ maxWidth: screenWidth === 'limited' ? 1280 : undefined }}
      >
        {(path === '' || path === '/' || path.startsWith('/lobby/')) && (
          <GameList />
        )}
        {children}
      </div>
    </>
  );
};
