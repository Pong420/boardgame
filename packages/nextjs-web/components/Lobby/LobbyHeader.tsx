import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from './Lobby.module.scss';
import { ButtonPopover } from '../ButtonPopover';

interface Props {
  title?: string;
  children?: ReactNode;
}

export function LobbyHeader({ title, children }: Props) {
  return (
    <div className={styles['lobby-header']}>
      <Link href="/">
        <ButtonPopover content="Back to home" icon="arrow-left" minimal />
      </Link>
      <div className={styles['lobby-header-header-title']}>{title}</div>
      <div>{children}</div>
    </div>
  );
}
