import React from 'react';
import Image from 'next/image';
import { GameListHeader } from './GameListHeader';
import { GameMeta } from '@/typings';
import { gameMetadata } from '@/games';
import { NavLink } from '@/components/NavLink';
import styles from './GameList.module.scss';

interface ItemProps {
  meta: GameMeta;
}

const gameIconFallback = <div className={styles['game-icon-fallback']} />;

export function GameListItem({ meta }: ItemProps) {
  const { gameName, icon, numPlayers } = meta;

  const _icon = (
    <div className={styles['game-icon']}>
      {icon ? (
        typeof icon === 'string' ? (
          <Image src={icon} alt={`${gameName}-icon`} unsized />
        ) : (
          icon
        )
      ) : (
        gameIconFallback
      )}
    </div>
  );

  return (
    <NavLink
      href={`/lobby/${meta.name}`}
      activeClassName={styles['game-list-item-active']}
      prefetch={false}
    >
      <a className={styles['game-list-item']} href="/">
        {_icon}
        <div className={styles['game-list-item-content']}>
          <div className={styles['game-name']}>{gameName}</div>
          <div>
            {numPlayers.join(numPlayers.length === 2 ? ' - ' : ' / ')} players
          </div>
        </div>
      </a>
    </NavLink>
  );
}

export function GameList() {
  return (
    <div className={styles['game-list']}>
      <GameListHeader />
      <div className={styles['game-list-content']}>
        {gameMetadata.map(meta => (
          <GameListItem key={meta.name} meta={meta} />
        ))}
      </div>
    </div>
  );
}
