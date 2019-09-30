import React, { ReactNode } from 'react';
import { MyDeck } from './MyDeck';
import { OtherDeck } from './OtherDeck';
import { BoardComponentProps } from '../../typings';

export function BigTwoBoard({
  isConnected,
  G,
  ctx,
  moves,
  playerID
}: BoardComponentProps) {
  const { players, opponents } = G;
  const { phase } = ctx;
  const player = players[Number(playerID)];

  if (!isConnected) {
    return <div className="disconnected">Connecting ...</div>;
  }

  let content: ReactNode;

  if (phase === 'ready') {
    if (player.ready) {
      content = (
        <div>
          Waiting for Player
          {opponents
            .filter(({ ready }) => !ready)
            .map(({ id }) => id)
            .join(',')}
        </div>
      );
    } else {
      content = <button onClick={() => moves.ready(playerID)}>Ready</button>;
    }
  } else {
    content = (
      <>
        <MyDeck deck={player.hand} setHand={moves.setHand} />
        {opponents.map(({ numOfCards }, index) => (
          <OtherDeck key={index} index={index} numOfCards={numOfCards} />
        ))}
      </>
    );
  }

  return <div className={`big-two-board ${phase}`.trim()}>{content}</div>;
}
