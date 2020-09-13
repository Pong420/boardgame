import { GameMeta } from '@/typings';
import { TicTacToeMeta } from './tic-tac-toe/meta';

export const gameMetadata = [TicTacToeMeta];

export const gameMetaMap = gameMetadata.reduce(
  (result, meta) => ({ ...result, [meta.name]: meta }),
  {} as Record<string, GameMeta>
);
