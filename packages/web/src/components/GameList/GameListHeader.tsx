import React from 'react';
import { Button } from '@blueprintjs/core';
import { Preferences } from '../Preferences';

export function GameListHeader() {
  return (
    <div className="game-list-header">
      <Preferences />
      <div className="header-title">Games</div>
      <Button minimal icon="blank" />
    </div>
  );
}
