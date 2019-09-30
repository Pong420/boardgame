export const points = [
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A',
  '2'
];
export const suits = ['s', 'h', 'c', 'd'];

export const deck: string[] = Array.prototype.concat.apply(
  [],
  suits.map(suit => points.map(points => points + suit))
);
