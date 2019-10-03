import { BigTwo, BigTwoBoard } from './BigTwo';

export const games = ['Big Two'];

export const gameConfig: Record<typeof games[number], any> = {
  'Big Two': {
    game: BigTwo,
    board: BigTwoBoard,
    maxPlayers: 4,
    minPlayers: 2
  }
};
