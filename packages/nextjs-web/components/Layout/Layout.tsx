import React, { ReactNode } from 'react';
import styles from './Layout.module.scss';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <div className={styles.layout}>{children}</div>;
};
