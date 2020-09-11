import React from 'react';
import { GameMeta } from '@/typings';
import { CreateMatch } from './CreateMatch';
import { ButtonPopover } from '../ButtonPopover';
import { Link } from 'gatsby';
import { Button, ButtonGroup } from '@blueprintjs/core';

interface OnRefresh {
  updating?: boolean;
  onRefresh: () => void;
}

interface Props extends OnRefresh {
  meta: GameMeta;
}

export function LobbyHeader({ meta, updating, onRefresh }: Props) {
  return (
    <div className="lobby-header">
      <Link to="/">
        <ButtonPopover icon="arrow-left" content="Leave" minimal />
      </Link>
      <Button minimal icon="blank" style={{ visibility: 'hidden' }} />
      <div className="header-title">{meta.gameName} Lobby</div>
      <ButtonGroup>
        <CreateMatch minimal icon="plus" content="Create Match" meta={meta} />
        <Button minimal icon="refresh" loading={updating} onClick={onRefresh} />
      </ButtonGroup>
    </div>
  );
}
