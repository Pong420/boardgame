import { setHand } from './setHand';
import { pass } from './pass';
import { playCard } from './playCard';

export const moves = {
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
