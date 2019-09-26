import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { useDrag } from 'react-use-gesture';
import { useSprings, to } from 'react-spring';
import { Card, CARD_WIDTH, CARD_HEIGHT } from '../Card';
import { useMeasure } from '../../hooks/useMeasure';
import clamp from 'lodash-es/clamp';
import swap from 'array-move';

interface Props {
  deck: string[];
}

interface FnProps {
  width: number;
  order: number[];
  down?: boolean;
  originalIndex?: number;
  curIndex?: number;
  x?: number;
  y?: number;
  selected?: boolean;
}

export function MyDeck({ deck }: Props) {
  const order = useRef(deck.map((_, index) => index));

  const selected = useRef<number[]>([]);
  const dragDelta = React.useRef(0);

  const [bindMeasure, { width: viewWidth }] = useMeasure<HTMLDivElement>();

  const width = useMemo(
    () => Math.max(CARD_WIDTH / 4, Math.min(viewWidth / deck.length, CARD_WIDTH + 10)),
    [viewWidth, deck.length]
  );

  const fn = useCallback(
    ({ width, order, down = false, originalIndex = -1, curIndex = -1, x = 0, y = 0 }: FnProps) => {
      return (index: number) => {
        return down && index === originalIndex
          ? {
              x: curIndex * width + x,
              y,
              scale: 1.1,
              zIndex: order.length,
              shadow: 15,
              immediate: (n: any) => n === 'x' || n === 'y' || n === 'zIndex'
            }
          : {
              x: order.indexOf(index) * width,
              y: selected.current.includes(index) ? CARD_HEIGHT * -0.1 : 0,
              scale: 1,
              zIndex: order.indexOf(index),
              shadow: 1,
              immediate: (n: any) => n === 'zIndex'
            };
      };
    },
    []
  );

  const [springs, setSprings] = useSprings(deck.length, fn({ width, order: order.current }));

  const bind = useDrag(
    ({ first, last, down, time = 0, args: [originalIndex], movement: [x, y], distance }) => {
      if (first) {
        dragDelta.current = time;
      } else if (last) {
        dragDelta.current = time - dragDelta.current;
      }

      const curIndex = order.current.indexOf(originalIndex);
      const curCol = clamp(Math.round((curIndex * width + x) / width), 0, deck.length - 1);
      const newOrder = swap(order.current, curIndex, curCol);

      if (distance > 1) {
        setSprings(fn({ width, order: newOrder, down, originalIndex, curIndex, x, y }));
        if (!down) order.current = newOrder;
      }
    }
  );

  const toggleSelection = useCallback(
    originalIndex => () => {
      const index = selected.current.indexOf(originalIndex);
      const select = index === -1;

      if (dragDelta.current < 100) {
        selected.current = select
          ? [...selected.current, originalIndex]
          : [...selected.current.slice(0, index), ...selected.current.slice(index + 1)];
        setSprings(idx => ({
          y: selected.current.includes(idx) ? -10 : 0
        }));
      } else {
        dragDelta.current = 0;
      }
    },
    [setSprings]
  );

  useEffect(() => {
    setSprings(fn({ width, order: order.current }));
  }, [setSprings, deck, width, fn]);

  return (
    <div className="my-deck" {...bindMeasure}>
      <div className="cards">
        {springs.map(({ zIndex, shadow, x, y, scale }, i) => {
          const poker = deck[i];
          return (
            <Card
              {...bind(i)}
              onClick={toggleSelection(i)}
              key={i}
              poker={poker}
              style={{
                zIndex,
                boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                transform: to(
                  [x, y, scale],
                  (x, y, s) => `translate3d(${x}px,${y}px,0) scale(${s})`
                )
              }}
            />
          );
        })}
      </div>
    </div>
  );
}