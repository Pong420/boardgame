import React from 'react';
import { Link } from 'gatsby';
import { useRxAsync } from 'use-rx-hooks';
import { GameListHeader } from './GameListHeader';
import { getAllGames } from '@/services';
import { useGameMeta } from '@/store/gameMeta';
import { Toaster } from '@/utils/toaster';

interface ItemProps {
  name: string;
}

const gameIconFallback = <div className="game-icon-fallback" />;

const onFailure = Toaster.apiError.bind(Toaster, 'Get Games Failure');

export function GameListItem({ name }: ItemProps) {
  const { gameName, icon, numPlayers = [], version } = useGameMeta(name) || {};

  return (
    <Link
      to={`/lobby/${name}/`}
      className="game-list-item"
      activeClassName="active"
    >
      <div className="game-icon">
        {icon ? <img src={icon} alt={icon} /> : gameIconFallback}
      </div>
      <div className="game-list-item-content">
        <div className="game-name">{gameName}</div>
        <div>
          {numPlayers.join(numPlayers.length === 2 ? ' - ' : ' / ')} players
        </div>
      </div>
      <div className="game-version">v{version}</div>
    </Link>
  );
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
