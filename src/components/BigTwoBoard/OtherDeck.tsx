import React, { ReactNode } from 'react';
import { CardBack } from '../Card';

interface Props {
  numOfCards: number;
  index: number;
}

export function OtherDeck({ numOfCards, index }: Props) {
  const clasNameForPos = ['left', 'top', 'right'][index];
  const cards: ReactNode[] = [];

  for (let i = 0; i < numOfCards; i++) {
    cards.push(<CardBack key={i} degree={(index + 1) * 90} />);
  }

  return (
    <div className={`other-deck ${clasNameForPos}`}>
      <div className="cards">{cards}</div>
    </div>
  );
}
