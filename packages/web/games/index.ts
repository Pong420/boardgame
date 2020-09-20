import { GameMeta } from '@/typings';
import { TicTacToeMeta } from './tic-tac-toe/meta';
import { BigTwoMeta } from './big-two/meta';

export const gameMetadata = [TicTacToeMeta, BigTwoMeta];

export const gameMetaMap = gameMetadata.reduce(
  (result, meta) => ({ ...result, [meta.name]: meta }),
  {} as Record<string, GameMeta>
);
