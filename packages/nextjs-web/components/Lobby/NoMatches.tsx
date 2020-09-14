import React from 'react';
import { CreateMatch, Create } from './CreateMatch';
import styles from './Lobby.module.scss';

export function NoMatches(props: Create) {
  return (
    <div className={styles['styles']}>
      <div>
        <div className="message">No Matches Found</div>
        <CreateMatch {...props} intent="primary" text="Create Match" />
      </div>
    </div>
  );
}
