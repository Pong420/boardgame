import React from 'react';
import Link from 'next/link';
import { ButtonPopover } from '../ButtonPopover';
import { Header, HeaderProps } from '../Header';

export function LobbyHeader(props: HeaderProps) {
  return (
    <Header
      {...props}
      left={
        <Link href="/">
          <ButtonPopover content="Back to home" icon="arrow-left" minimal />
        </Link>
      }
    />
  );
}
