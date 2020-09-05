import React, { useCallback } from 'react';
import { generatePath, NavLink } from 'react-router-dom';
import { useRxAsync } from 'use-rx-hooks';
import { GameListHeader } from './GameListHeader';
import { PATHS } from '../../../constants';

interface ItemProps {
  name: string;
}

interface GameListProps {
  games: string[];
}

interface Meta {
  version: string;
  name: string;
  icon: string;
  author: string;
  numOfPlayers: string;
  description?: string;
  guide: string[];
}

const gameIconFallback = <div className="game-icon-fallback" />;

export function GameListItem({ name }: ItemProps) {
  const getMeta = useCallback(
    () => import(`@boardgame/${name}/dist/meta`) as Promise<{ default: Meta }>,
    [name]
  );
  const [{ data, loading }] = useRxAsync(getMeta);

  if (loading) {
    return null;
  }

  const { name: gameName, icon, numOfPlayers, version } = data?.default || {};

  return (
    <NavLink to={generatePath(PATHS.HOME, { name })} className="game-list-item">
      <div className="game-icon">
        {icon ? <img src={icon} alt={icon} /> : gameIconFallback}
      </div>
      <div className="game-list-item-content">
        <div className="game-name">{gameName}</div>
        <div>{numOfPlayers}</div>
      </div>
      <div className="game-version">v{version}</div>
    </NavLink>
  );
}

export function GameList({ games }: GameListProps) {
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
