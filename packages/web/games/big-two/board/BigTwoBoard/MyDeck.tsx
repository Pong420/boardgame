import React, { useRef, useEffect, useMemo } from 'react';
import { useDrag } from 'react-use-gesture';
import { useSprings, to } from 'react-spring';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { Card, CARD_HEIGHT } from '../Card';
import { sortBy, SortByType } from '../../utils/sortBy';
import { useTranslate } from '../../utils/useTranslate';
import { BigTwoMoves } from '../../typings';
import clamp from 'lodash/clamp';
import swap from 'array-move';

interface Props {
  deck: string[];
  isActive: boolean;
  moves: BigTwoMoves;
  disablePass?: boolean;
}

interface GetSpringOptions {
  down?: boolean;
  originalIndex?: number;
  curIndex?: number;
  x?: number;
  y?: number;
  selected?: boolean;
}

export function MyDeck({ isActive, disablePass, deck, moves }: Props) {
  const initialDeck = useRef(deck);
  const selected = useRef<number[]>([]);
  const dragDelta = useRef(0);
  const order = useRef<number[]>(
    deck.map(card => initialDeck.current.indexOf(card))
  );

  const [{ translateX, maxWidth }, ref] = useTranslate<HTMLDivElement>({
    axis: 'x',
    numOfCards: deck.length
  });

  const { getSpring } = useMemo(() => {
    function getSpring(order: number[], props?: GetSpringOptions) {
      const { down = false, originalIndex = -1, curIndex = -1, x = 0, y = 0 } =
        props || {};
      return (index: number) => {
        return down && index === originalIndex
          ? {
              x: curIndex * translateX + x,
              y,
              zIndex: order.length,
              scale: 1.1,
              shadow: 15,
              immediate: (n: any) => n === 'x' || n === 'y' || n === 'zIndex'
            }
          : {
              x: order.indexOf(index) * translateX,
              y: selected.current.includes(index) ? CARD_HEIGHT * -0.1 : 0,
              zIndex: order.indexOf(index),
              scale: 1,
              shadow: 1,
              immediate: (n: any) => n === 'zIndex'
            };
      };
    }

    return { getSpring };
  }, [translateX]);

  const [springs, setSprings] = useSprings(
    initialDeck.current.length,
    getSpring(order.current)
  );

  const bind = useDrag(
    ({ down, args, movement, distance, first, last, timeStamp }) => {
      const [originalIndex] = args;
      const [x, y] = movement;

      const curIndex = order.current.indexOf(originalIndex);
      const curCol = clamp(
        Math.round((curIndex * translateX + x) / translateX),
        0,
        deck.length - 1
      );
      const newOrder = swap(order.current, curIndex, curCol);

      setSprings(getSpring(newOrder, { down, originalIndex, curIndex, x, y }));

      if (first) {
        dragDelta.current = timeStamp;
      } else if (last) {
        dragDelta.current = timeStamp - dragDelta.current;
      }

      if (!down) {
        order.current = newOrder;
        moves.setHand(newOrder.map(index => initialDeck.current[index]));

        if (distance <= 10 && dragDelta.current < 250) {
          const index = selected.current.indexOf(originalIndex);
          const select = index === -1;
          selected.current = select
            ? [...selected.current, originalIndex]
            : [
                ...selected.current.slice(0, index),
                ...selected.current.slice(index + 1)
              ];

          setSprings(idx => ({
            y: selected.current.includes(idx) ? -10 : 0
          }));
        } else {
          dragDelta.current = 0;
        }
      }
    }
  );

  const sortHandler = (type: SortByType) => () => {
    moves.setHand(sortBy(type, deck));
  };

  useEffect(() => {
    order.current = deck.map(card => initialDeck.current.indexOf(card));
    setSprings(getSpring(order.current));
  }, [deck, setSprings, getSpring]);

  return (
    <div className="my-deck" ref={ref}>
      <ButtonGroup className="big-two-control">
        <Button onClick={sortHandler('points')}>Sort by Points</Button>
        <Button onClick={sortHandler('suits')}>Sort by Suits</Button>
        <Button
          onClick={() => moves.pass()}
          disabled={disablePass || !isActive}
        >
          Pass
        </Button>
        <Button
          disabled={!isActive}
          onClick={() => {
            moves.playCard(
              selected.current.map(index => initialDeck.current[index])
            );
            selected.current = [];
          }}
        >
          Play Cards
        </Button>
      </ButtonGroup>
      <div className="cards" style={{ maxWidth }}>
        {springs.map(({ zIndex, shadow, x, y, scale }, i) => {
          const value = initialDeck.current[i];
          if (deck.includes(value)) {
            return (
              <Card
                {...bind(i)}
                value={value}
                key={i}
                style={
                  {
                    zIndex,
                    boxShadow: shadow.to(
                      s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
                    ),
                    transform: to(
                      [x, y, scale],
                      (x, y, s) => `translate3d(${x}px,${y}px,0) scale(${s})`
                    )
                  } as any
                }
              />
            );
          }
          return null;
        })}
      </div>
      <style jsx>{`
        .my-deck {
          @include relative();
        }

        .big-two-control {
          @include absolute(-15px);
          @include dimen(100%);
          @include flex(center, center);
          transform: translateY(-100%);
        }

        .cards {
          @include dimen(100%);
          margin: auto;
        }

        .card {
          @include absolute();
          transform-origin: center bottom;
        }
      `}</style>
    </div>
  );
}
