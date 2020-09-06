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
      <div className="header-title"></div>
      <ButtonGroup>
        <CreateMatch
          name={meta.name}
          gameGame={meta.gameName}
          numOfPlayers={meta.numOfPlayers}
        />
      </ButtonGroup>
    </div>
  );
}
