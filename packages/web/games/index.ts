import { GameMeta } from '@/typings';
import { Game } from 'boardgame.io';
import { TicTacToeMeta } from './tic-tac-toe/meta';
import { BigTwoMeta } from './big-two/meta';
import { game as TicTacToe } from './tic-tac-toe/game';
import { game as BigTwo } from './big-two/game';

export const games = [TicTacToe, BigTwo] as Game[];

export const gameMetadata = [TicTacToeMeta, BigTwoMeta];

export const gameMetaMap = gameMetadata.reduce(
  (result, meta) => ({ ...result, [meta.name]: meta }),
  {} as Record<string, GameMeta>
);
