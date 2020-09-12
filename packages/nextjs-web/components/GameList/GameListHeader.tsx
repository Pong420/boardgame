import React from 'react';
import { Button } from '@blueprintjs/core';
import styles from './GameList.module.scss';
// import { Preferences } from '../Preferences';

export function GameListHeader() {
  return (
    <div className={styles['game-list-header']}>
      {/* <Preferences /> */}
      <div className={styles['game-list-header-title']}>Games</div>
      <Button minimal icon="blank" />
    </div>
  );
}
