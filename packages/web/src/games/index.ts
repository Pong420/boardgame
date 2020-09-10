import { GameMeta } from '@/typings';
import { BigTwoMeta } from './big-two/meta';

export const games = [BigTwoMeta];

export const gameMetaMap = games.reduce(
  (result, meta) => ({ ...result, [meta.name]: meta }),
  {} as Record<string, GameMeta>
);
