import React from 'react';
import { animated } from 'react-spring';
import { CardBack } from './CardBack';

type AnimatedDivParams = Parameters<typeof animated['div']>;
type AnimatedDivProps = AnimatedDivParams[0];

interface Props extends AnimatedDivProps {
  poker: string;
  degree?: number;
}

export const CARD_HEIGHT = 120;
export const CARD_WIDTH = CARD_HEIGHT * 0.75;

export const Card = ({ poker, degree, style, ...props }: Props) => {
  return (
    <animated.div
      className="card"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT, ...style }}
      {...props}
    >
      <CardBack degree={degree} />
      <img
        className="front"
        draggable={false}
        src={window.Poker.getCardData(
          CARD_HEIGHT * 3,
          poker[1],
          poker[0].replace(/t/i, '10')
        )}
        alt=""
      />
    </animated.div>
  );
};
