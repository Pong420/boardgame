import React from 'react';
import CardFront from '../Card/CardFront';

export default function Center(props) {
  const { history } = props.G;

  return (
    <div className="center">
      <div>
        <div className="last-hand">
          {history.hand ? history.hand.map(card => <CardFront card={card} key={card} />) : ''}
        </div>
        <div className="message">{props.isActive ? 'Your Turn' : `Waiting for Player ${props.ctx.currentPlayer}`}</div>
      </div>
    </div>
  );
}
