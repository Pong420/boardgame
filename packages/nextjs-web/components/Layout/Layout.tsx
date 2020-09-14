import React, { ReactNode } from 'react';
import styles from './Layout.module.scss';
import { usePreferencesState } from '@/services';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { screenWidth } = usePreferencesState();

  return (
    <div
      className={styles.layout}
      style={{ maxWidth: screenWidth === 'limited' ? 1280 : undefined }}
    >
      {children}
    </div>
  );
};
