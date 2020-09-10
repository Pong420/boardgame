import React, { MouseEvent } from 'react';
import { animated } from 'react-spring';
import { CardBack } from './CardBack';

type AnimatedDivParams = Parameters<typeof animated['div']>;
type AnimatedDivProps = AnimatedDivParams[0];

interface Props extends AnimatedDivProps {
  value: string;
  degree?: number;
}

export const CARD_HEIGHT = 120;
export const CARD_WIDTH = CARD_HEIGHT * 0.75;

function preventImageDrag(e: MouseEvent) {
  e.preventDefault();
}

export function Card(_props: Props) {
  const { value, degree, style, ...props } = _props;
  if (value) {
    const src = window.Poker.getCardData(
      CARD_HEIGHT * 3,
      value[1],
      value[0].replace(/t/i, '10')
    );

    return (
      <animated.div
        {...props}
        className="card"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT, ...style }}
      >
        <CardBack degree={degree} />
        <img
          className="front"
          src={src}
          draggable={false}
          // for firefox
          onDragStart={preventImageDrag}
          alt=""
        />
      </animated.div>
    );
  }

  return null;
}
