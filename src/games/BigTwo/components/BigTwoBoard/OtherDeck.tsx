import React from 'react';
import { CardBack } from '../Card';

interface Props {
  numOfCards: number;
  index: number;
}

export function OtherDeck({ numOfCards, index }: Props) {
  const clasNameForPos = ['left', 'top', 'right'][index];

  return (
    <div className={`other-deck ${clasNameForPos}`}>
      <div className="cards">
        {Array.from({ length: numOfCards }, (_, i) => (
          <CardBack key={i} degree={(index + 1) * 90} />
        ))}
      </div>
    </div>
  );
}
