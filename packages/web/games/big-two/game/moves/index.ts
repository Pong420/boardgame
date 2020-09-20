import { ready } from './ready';
import { setHand } from './setHand';
import { pass } from './pass';
import { playCard } from './playCard';

export const moves = {
  ready: {
    move: ready,
    client: false
  },
  setHand: {
    move: setHand,
    client: false,
    noLimit: true,
    redact: true
  },
  pass: {
    move: pass,
    client: false,
    noLimit: true,
    redact: true
  },
  playCard: {
    move: playCard,
    client: false,
    noLimit: true,
    redact: true
  }
};
