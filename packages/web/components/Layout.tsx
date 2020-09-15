import React, { ReactNode, useEffect } from 'react';
import router from 'next/router';
import { useActivate } from '@/hooks/useActivate';
import { storageSupport } from '@/utils/storage';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useActivate();

  useEffect(() => {
    !storageSupport() &&
      router.push(
        '/error/Sorry, The website relies on local storage. You should enable it to continue '
      );
  }, []);

  return <div className="layout">{children}</div>;
};
