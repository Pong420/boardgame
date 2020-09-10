import { useEffect, useRef, useState } from 'react';
import { fromEvent } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { CARD_WIDTH } from '../board/Card';

export type Axis = 'x' | 'y';

interface Props {
  numOfCards: number;
  axis: Axis;
}

export const gap = 10;

export const getMaximumDimen = (numOfCards: number) =>
  (CARD_WIDTH + gap) * numOfCards - gap;

export function useTranslate<T extends HTMLElement>({
  numOfCards,
  axis
}: Props) {
  const ref = useRef<T>(null);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);

  useEffect(() => {
    const getTranslate = (ref: number) =>
      Math.min(
        CARD_WIDTH - (CARD_WIDTH * numOfCards - ref) / (numOfCards - 1),
        CARD_WIDTH + gap
      );

    const subscription = fromEvent(window, 'resize')
      .pipe(startWith(null))
      .subscribe(() => {
        const el = ref.current;
        if (el) {
          if (axis === 'x') {
            setTranslateX(getTranslate(el.offsetWidth));
          } else {
            setTranslateY(getTranslate(el.offsetHeight));
          }
          setMaxWidth(getMaximumDimen(numOfCards));
        }
      });
    return () => subscription.unsubscribe();
  }, [axis, numOfCards]);

  return [{ translateX, translateY, maxWidth }, ref] as const;
}
