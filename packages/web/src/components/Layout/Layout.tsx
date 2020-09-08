import React, { ReactNode, useEffect } from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@/typings';
import { useActivate } from '@/hooks/useActivate';
import { usePreferencesState, gotoMatch, matchStorage } from '@/services';
import { storageSupport } from '@/utils/storage';
import { SEO } from '../SEO';
import { GameList } from '../GameList';

interface LayoutProps extends RouteComponentProps {
  children?: ReactNode;
}

export const Layout = ({ children, path }: LayoutProps) => {
  const { screenWidth } = usePreferencesState();

  useActivate(path);

  useEffect(() => {
    !storageSupport() &&
      navigate(
        '/error/Sorry, the website relies on local storage so you need to disable the blocker'
      );
  }, []);

  if (!path.startsWith('/match') && !path.startsWith('/error')) {
    const match = matchStorage.get();
    if (match) {
      gotoMatch(match);
      return null;
    }
  }

  return (
    <div
      className="layout"
      style={{ maxWidth: screenWidth === 'limited' ? 1280 : undefined }}
    >
      <SEO />

      {(path === '' ||
        path === '/' ||
        path === '/*' ||
        path.startsWith('/lobby/')) && <GameList />}

      {children}
    </div>
  );
};
