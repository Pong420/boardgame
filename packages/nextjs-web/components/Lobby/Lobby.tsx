import React from 'react';
import { GameMeta } from '@/typings';
import { Layout } from '@/components/Layout';
import { LobbyHeader } from './LobbyHeader';
import { CreateMatch } from './CreateMatch';
import styles from './Lobby.module.scss';

interface Props extends GameMeta {}

export function Lobby(meta: Props) {
  const { gameName } = meta;
  return (
    <Layout>
      <LobbyHeader title={`Lobby - ${gameName}`}>
        <CreateMatch meta={meta} icon="plus" content="Create Match" minimal />
      </LobbyHeader>
      <div className={styles['lobby-content']}></div>
    </Layout>
  );
}
