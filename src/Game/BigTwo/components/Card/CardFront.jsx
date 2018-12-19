import React from 'react';
import Card, { CARD_HEIGHT } from './';
import pokerProducer from '../../game/helper/pokerProducer.js';

export default function CardFront(props) {
  return (
    <Card
      className={`card-front ${props.selected ? 'selected' : ''}`}
      src={getCardFront(props.card)}
      onClick={() => {
        if (typeof props.onClick === 'function') {
          props.onClick(props.card);
        }
      }}
    />
  );
}

function getCardFront(card) {
  const [point, suit] = card.toLowerCase().split('');
  return pokerProducer.getCardData(CARD_HEIGHT, suit, point.replace('t', '10'));
}
