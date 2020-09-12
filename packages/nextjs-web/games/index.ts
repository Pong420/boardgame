import { GameMeta } from '@/typings';
import { TicTacToeMeta } from './tic-tac-toe/meta';

export const games = [TicTacToeMeta];

export const gameMetaMap = games.reduce(
  (result, meta) => ({ ...result, [meta.name]: meta }),
  {} as Record<string, GameMeta>
);
