import ready from './phase/ready';
import draw from './phase/draw';
import start from './phase/start';

export default {
  startingPhase: 'ready',

  phases: {
    ready,
    draw,
    start
  }
};
