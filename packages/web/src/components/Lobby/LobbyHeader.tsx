import React from 'react';
import { Link } from 'gatsby';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { GameMeta } from '@/typings';
import { CreateMatch } from './CreateMatch';
import { ButtonPopover } from '../ButtonPopover';

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
        <ButtonPopover icon="arrow-left" content="Back to home" minimal />
      </Link>
      <Button minimal icon="blank" style={{ visibility: 'hidden' }} />
      <div className="header-title">{meta.gameName} Lobby</div>
      <ButtonGroup>
        <CreateMatch minimal icon="plus" content="Create Match" meta={meta} />
        <ButtonPopover
          minimal
          icon="refresh"
          content="Refresh"
          loading={updating}
          onClick={onRefresh}
        />
      </ButtonGroup>
    </div>
  );
}
