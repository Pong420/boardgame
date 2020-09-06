import React from 'react';
import { GameMeta } from '@/typings';
import { LobbyHeader } from './LobbyHeader';

interface Props {
  meta: GameMeta;
}

export function Lobby({ meta }: Props) {
  return (
    <div className="lobby">
      <LobbyHeader />
      <div className="lobby-content">
        <pre>{JSON.stringify(meta, null, 2)}</pre>
      </div>
    </div>
  );
}
