import { points, suits } from '../constants';

type Priority = [string[], number];

function compare(a: string, b: string, [arr, idx]: Priority) {
  if (arr.indexOf(a[idx]) > arr.indexOf(b[idx])) return 1;
  if (arr.indexOf(a[idx]) < arr.indexOf(b[idx])) return -1;
  return 0;
}

const defaultPriority: Priority[] = [[points, 0], [suits, 1]];

export function sortBy(type: 'points' | 'suits') {
  return (cards: string[]) => {
    const priority =
      type === 'points' ? defaultPriority : defaultPriority.slice().reverse();

    return cards.slice().sort((a, b) => {
      return compare(a, b, priority[0]) || compare(a, b, priority[1]);
    });
  };
}
