import { ready } from './ready';
import { draw } from './draw';
import { start } from './start';

export const flow = {
  startingPhase: 'ready',

  phases: {
    ready,
    draw,
    start
  }
};
