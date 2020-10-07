import React from 'react';
import router from 'next/router';
import { Button } from '@blueprintjs/core';
import { Header, HeaderProps } from '@/components/Header';

interface Props extends HeaderProps {
  name: string;
}

export function SpectatorHeader({ name, ...props }: Props) {
  return (
    <Header
      {...props}
      left={
        <Button
          minimal
          icon="arrow-left"
          onClick={() => router.push(`/lobby/${name}`)}
        />
      }
    />
  );
}
