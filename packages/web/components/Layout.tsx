import React, { ReactNode } from 'react';
import { useActivate } from '@/hooks/useActivate';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useActivate();

  return <div className="layout">{children}</div>;
};
