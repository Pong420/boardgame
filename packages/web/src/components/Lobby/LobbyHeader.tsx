import React from 'react';
import { GameMeta } from '@/typings';
import { CreateMatch } from './CreateMatch';
import { ButtonPopover } from '../ButtonPopover';
import { Link } from 'gatsby';
import { ButtonGroup } from '@blueprintjs/core';

interface Props {
  meta: GameMeta;
}

export function LobbyHeader({ meta }: Props) {
  return (
    <div className="lobby-header">
      <Link to="/">
        <ButtonPopover icon="arrow-left" content="Leave" minimal />
      </Link>
      <div className="header-title">{meta.gameName} Lobby</div>
      <ButtonGroup>
        <CreateMatch
          minimal
          icon="plus"
          content="Create Match"
          name={meta.name}
          gameName={meta.gameName}
          numPlayers={meta.numPlayers}
        />
      </ButtonGroup>
    </div>
  );
}
