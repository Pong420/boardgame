import React from 'react';
import { Github } from '../Github';
import styles from './Home.module.scss';

export function Home() {
  return (
    <div className={styles.home}>
      <div className={styles['home-header']} />
      <div className={styles['home-content']}>
        <div className={styles['home-title']}>
          Let's Play
          <br />
          Boardgame
        </div>

        <Github className={styles['github']} />
      </div>
    </div>
  );
}
