import React from 'react';
import Link from 'next/link';
import styles from './Lobby.module.scss';
import { ButtonPopover } from '../ButtonPopover';

interface Props {
  title?: string;
}

export function LobbyHeader({ title }: Props) {
  return (
    <div className={styles['lobby-header']}>
      <Link href="/" >
        <ButtonPopover content="Back to home" icon="arrow-left" minimal />
      </Link>
      <div className={styles['lobby-header-header-title']}>{title}</div>
    </div>
  );
}
