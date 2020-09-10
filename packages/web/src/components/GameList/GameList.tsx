import React from 'react';
import { Link } from 'gatsby';
import { useRxAsync } from 'use-rx-hooks';
import { GameListHeader } from './GameListHeader';
import { getAllGames } from '@/services';
import { gameMetaMap } from '@/games';
import { Toaster } from '@/utils/toaster';

interface ItemProps {
  name: string;
}

const gameIconFallback = <div className="game-icon-fallback" />;

const onFailure = Toaster.apiError.bind(Toaster, 'Get Games Failure');

export function GameListItem({ name }: ItemProps) {
  const meta = gameMetaMap[name];

  if (meta) {
    const { gameName, icon, numPlayers } = meta;
    return (
      <Link
        to={`/lobby/${name}/`}
        className="game-list-item"
        activeClassName="active"
      >
        <div className="game-icon">
          {icon ? (
            typeof icon === 'string' ? (
              <img src={icon} alt={icon} />
            ) : (
              icon
            )
          ) : (
            gameIconFallback
          )}
        </div>
        <div className="game-list-item-content">
          <div className="game-name">{gameName}</div>
          <div>
            {numPlayers.join(numPlayers.length === 2 ? ' - ' : ' / ')} players
          </div>
        </div>
      </Link>
    );
  }
  return null;
}

export function GameList() {
  const [{ data }] = useRxAsync(getAllGames, { onFailure });
  const games = data?.data || [];

  return (
    <div className="game-list">
      <GameListHeader />
      <div className="game-list-content">
        {games.map(name => (
          <GameListItem key={name} name={name} />
        ))}
      </div>
    </div>
  );
}
