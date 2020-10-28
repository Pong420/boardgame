import React, { ReactNode, useEffect, useState } from 'react';
import router from 'next/router';
import { defer } from 'rxjs';
import { GameList } from '@/components/GameList';
import { useActivate } from '@/hooks/useActivate';
import { storageSupport } from '@/utils/storage';
import { gotoMatch, matchStorage } from '@/services';

interface LayoutProps {
  children?: ReactNode;
  gameList?: boolean;
}

export const Layout = ({ children, gameList = false }: LayoutProps) => {
  const [ready, setReady] = useState(false);

  useActivate();

  useEffect(() => {
    const subscription = defer(() => {
      if (storageSupport()) {
        const state = matchStorage.get();
        if (state && !router.asPath.startsWith('/match')) {
          return gotoMatch(state);
        }
      } else {
        return router.push(
          '/error/Sorry, The website relies on local storage. You should enable it to continue '
        );
      }
      return Promise.resolve();
    }).subscribe(() => setReady(true));

    return () => subscription.unsubscribe();
  }, []);

  return ready ? (
    <div className="layout">
      {gameList && <GameList />}
      {children}
    </div>
  ) : null;
};
