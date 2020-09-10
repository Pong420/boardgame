import { GameMeta } from '@/typings';
import { BigTwoMeta } from './big-two/meta';
import { TicTacToeMeta } from './tic-tac-toe/meta';

export const games = [BigTwoMeta, TicTacToeMeta];

export const gameMetaMap = games.reduce(
  (result, meta) => ({ ...result, [meta.name]: meta }),
  {} as Record<string, GameMeta>
);
