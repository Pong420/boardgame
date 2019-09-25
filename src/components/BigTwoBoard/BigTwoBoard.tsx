import React from 'react';
import { MyDeck } from './MyDeck';
import { OtherDeck } from './OtherDeck';
import { Handler } from '../../typings';

interface Props {
  isConnected: boolean;
  playerID: string;
  readonly G: Handler;
}

export function BigTwoBoard({ isConnected, G, playerID }: Props) {
  const { players, otherPlayers } = G;
  const player = players[Number(playerID)];

  if (!isConnected) {
    return <div className="disconnected">Connecting ...</div>;
  }

  return (
    <div className="big-two-board">
      <MyDeck deck={player.cards} />
      {otherPlayers.map(({ cards }, index) => (
        <OtherDeck key={index} numOfCards={cards} index={index} />
      ))}
    </div>
  );
}
