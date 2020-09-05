import { TurnOrder } from 'boardgame.io/core';
import { Prefix_PhaseConfig } from '../../typings';

export const start: Prefix_PhaseConfig = {
  next: 'ready',
  turn: {
    order: TurnOrder.RESET
  }
};
