import React, { ReactNode, useEffect, useState } from 'react';
import router from 'next/router';
import { defer } from 'rxjs';
import { useActivate } from '@/hooks/useActivate';
import { storageSupport } from '@/utils/storage';
import { gotoMatch, matchStorage } from '@/services';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [ready, setReady] = useState(false);

  useActivate();

  useEffect(() => {
    const subscription = defer(() => {
      if (storageSupport()) {
        const state = matchStorage.get();
        if (state) {
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

  return ready ? <div className="layout">{children}</div> : null;
};
