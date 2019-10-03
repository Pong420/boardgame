import { BigTwoName, BigTwo, BigTwoBoard } from './BigTwo';

// Name should not contain space and capital letter
// https://github.com/nicolodavis/boardgame.io/issues/459

export const games = [BigTwoName];

export const gameConfig: Record<string, any> = {
  [BigTwoName]: {
    game: BigTwo,
    board: BigTwoBoard,
    maxPlayers: 4,
    minPlayers: 2
  }
};
