import React, { ReactNode } from 'react';
import { RouteComponentProps } from '@/typings';
import { useActivate } from '@/hooks/useActivate';
import { SEO } from '../SEO';
import { GameList } from '../GameList';
import { usePreferencesState, gotoMatch, matchStorage } from '@/services';

interface LayoutProps extends RouteComponentProps {
  children?: ReactNode;
}

export const Layout = ({ children, path }: LayoutProps) => {
  const { screenWidth } = usePreferencesState();

  useActivate(path);

  if (!path.startsWith('/match') && !path.startsWith('/error')) {
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
