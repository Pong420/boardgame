import React from 'react';
import { Card } from '../Card';
import { State, BoardComponentProps } from '../../typings';

interface Props extends BoardComponentProps<State> {
  isActive: boolean;
}

export function Center(props: BoardComponentProps<State>) {
  const { previous } = props.G;

  return (
    <div className="center">
      <div>
        <div className="last-hand">
          {previous.hand
            ? previous.hand.map((card: string) => (
                <Card poker={card} key={card} />
              ))
            : ''}
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
