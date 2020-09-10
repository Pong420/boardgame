import { points, suits } from './deck';

type Priority = [string[], number];
export type SortByType = 'points' | 'suits';

function compare(a: string, b: string, [arr, idx]: Priority) {
  if (arr.indexOf(a[idx]) > arr.indexOf(b[idx])) return 1;
  if (arr.indexOf(a[idx]) < arr.indexOf(b[idx])) return -1;
  return 0;
}

const defaultPriority: Priority[] = [
  [points, 0],
  [suits, 1]
];

export function sortBy(type: SortByType, deck: string[]) {
  const priority =
    type === 'points' ? defaultPriority : defaultPriority.slice().reverse();

  return deck.slice().sort((a, b) => {
    return compare(a, b, priority[0]) || compare(a, b, priority[1]);
  });
}
