import React from 'react';
import { CardBack } from '../Card';
import { useTranslate } from '../../utils/useTranslate';

interface Props {
  numOfCards: number;
  index: number;
}

export const OtherDeck = React.memo(({ numOfCards, index }: Props) => {
  const position = ['left', 'top', 'right'][index];
  const axis = position === 'top' ? 'x' : 'y';
  const [
    //
    { translateX, translateY, maxWidth },
    ref
  ] = useTranslate<HTMLDivElement>({
    axis,
    numOfCards
  });

  return (
    <div className={`other-deck ${position}`} ref={ref}>
      <div
        className="cards"
        style={axis === 'x' ? { maxWidth } : { maxHeight: maxWidth }}
      >
        {Array.from({ length: numOfCards }, (_, i) => (
          <CardBack
            key={i}
            degree={(index + 1) * 90}
            style={{
              transform: `translate(${translateX * i}px, ${translateY * i}px)`
            }}
          />
        ))}
      </div>
    </div>
  );
});
