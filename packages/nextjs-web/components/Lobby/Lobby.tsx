import React from 'react';
import { GameMeta } from '@/typings';
import { Layout } from '@/components/Layout';
import { LobbyHeader } from './LobbyHeader';
import styles from './Lobby.module.scss';

interface Props extends GameMeta {}

export function Lobby({ gameName }: Props) {
  return (
    <Layout>
      <LobbyHeader title={`Lobby - ${gameName}`} />
      <div className={styles['lobby-content']}></div>
    </Layout>
  );
}
