import React, { useRef } from 'react';
import { useDrag } from 'react-use-gesture';
import { useSprings, interpolate } from 'react-spring';
import { Card, CARD_WIDTH } from '../Card';
import { deck as deck_ } from '../../constants';
import clamp from 'lodash-es/clamp';
import swap from 'array-move';

const fn = (
  order: any[],
  down: boolean = false,
  originalIndex: number = -1,
  curIndex: number = -1,
  x: number = 0
) => (index: number) => {
  return down && index === originalIndex
    ? {
        x: curIndex * CARD_WIDTH + x,
        scale: 1.1,
        zIndex: 1,
        shadow: 15,
        immediate: (n: any) => n === 'x' || n === 'zIndex'
      }
    : { x: order.indexOf(index) * CARD_WIDTH, scale: 1, zIndex: 0, shadow: 1, immediate: false };
};

const deck = deck_.slice(0, 13);

export function Home() {
  const order = useRef(deck.map((_, index) => index));
  const [springs, setSprings] = useSprings(deck.length, fn(order.current));
  const bind = useDrag(({ args: [originalIndex], down, movement: [x] }) => {
    const curIndex = order.current.indexOf(originalIndex);
    const curRow = clamp(Math.round((curIndex * CARD_WIDTH + x) / CARD_WIDTH), 0, deck.length - 1);
    const newOrder = swap(order.current, curIndex, curRow);
    setSprings(fn(newOrder, down, originalIndex, curIndex, x));
    if (!down) order.current = newOrder;
  });

  return (
    <div className="home" style={{ width: deck.length * CARD_WIDTH }}>
      {springs.map(({ zIndex, shadow, x, scale }, i) => (
        <Card
          {...bind(i)}
          key={i}
          style={{
            zIndex,
            boxShadow: shadow.interpolate(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
            transform: interpolate([x, scale], (x, s) => `translate3d(${x}px,0,0) scale(${s})`)
          }}
          poker={deck[i]}
        />
      ))}
    </div>
  );
}
