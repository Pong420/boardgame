import React from 'react';
import { GameMeta } from '@/typings';
import Icon from '../../assets/tic-tac-toe.svg';

export const TicTacToeMeta: GameMeta = {
  name: 'tic-tac-toe',
  gameName: 'Tic-Tac-Toe',
  icon: React.createElement(Icon),
  numPlayers: [2],
  author: 'boardgame.io',
  description: '',
  spectate: 'all-players',
  bot: true
};
