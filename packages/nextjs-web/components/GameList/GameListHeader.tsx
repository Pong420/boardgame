import React from 'react';
import { Button } from '@blueprintjs/core';
import { Preferences } from '../Preferences';
import styles from './GameList.module.scss';

export function GameListHeader() {
  return (
    <div className={styles['game-list-header']}>
      <Preferences />
      <div className={styles['game-list-header-title']}>Games</div>
      <Button minimal icon="blank" />
    </div>
  );
}
