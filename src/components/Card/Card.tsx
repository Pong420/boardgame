import React from 'react';
import { animated } from 'react-spring';
import { CardBack } from './CardBack';

type AnimatedDivParams = Parameters<typeof animated['div']>;
type AnimatedDivProps = AnimatedDivParams[0];

interface Props extends AnimatedDivProps {
  poker: string;
  degree?: number;
}

export const CARD_HEIGHT = 100;
export const CARD_WIDTH = CARD_HEIGHT * 0.75;

export const Card = React.memo(({ poker, degree, ...props }: Props) => {
  return (
    <animated.div className="card" {...props}>
      <CardBack degree={degree} />
      <img
        className="front"
        draggable={false}
        style={{ width: CARD_WIDTH }}
        src={window.Poker.getCardData(CARD_HEIGHT * 3, poker[1], poker[0].replace(/t/i, '10'))}
        alt=""
      />
    </animated.div>
  );
});
