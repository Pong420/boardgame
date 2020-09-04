import React from 'react';
import { Card } from '../Card';
import { BigTwoBoardProps } from '../../typings';
import { useTranslate, getMaximumDimen } from '../../utils/useTranslate';

export function Center(props: BigTwoBoardProps) {
  const { previous } = props.G;
  const numOfCards = previous.hand?.length || 0;

  const [{ translateX }, ref] = useTranslate<HTMLDivElement>({
    axis: 'x',
    numOfCards
  });

  return (
    <div className="center">
      <div>
        <div className="last-hand" ref={ref}>
          <div
            className="cards"
            style={{ maxWidth: getMaximumDimen(numOfCards) }}
          >
            {previous.hand?.map((card: string, idx) => (
              <Card
                value={card}
                key={card}
                style={{
                  transform: `translate(${translateX * idx}px, 0)`
                }}
              />
            ))}
          </div>
        </div>
        <div className="message">
          {props.isActive
            ? 'Your Turn'
            : `Waiting for Player ${props.ctx.currentPlayer}`}
        </div>
      </div>
    </div>
  );
}
