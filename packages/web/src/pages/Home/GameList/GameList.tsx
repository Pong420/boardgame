import React from 'react';
import { generatePath, NavLink } from 'react-router-dom';
import {} from '@boardgame/big-two';
import { GameListHeader } from './GameListHeader';
import { PATHS } from '../../../constants';

interface ItemProps {
  name: string;
}

interface GameListProps {
  games: string[];
}

function getData(name: string) {
  switch (name) {
    case 'big-two':
      return ['', 'Big Two', '2 - 4 players'];
    default:
      return ['', 'Not Found', '404'];
  }
}

const gameIconFallback = <div className="game-icon-fallback" />;

export function GameListItem({ name }: ItemProps) {
  const [image, gameName, numOfPlayers] = getData(name) || [];
  return (
    <NavLink to={generatePath(PATHS.HOME, { name })} className="game-list-item">
      <div className="game-icon">
        {image ? <img src={image} alt={image} /> : gameIconFallback}
      </div>
      <div className="game-list-item-content">
        <div className="game-name">{gameName}</div>
        <div>{numOfPlayers}</div>
      </div>
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
