import React, { ReactNode } from 'react';
import { MyDeck } from './MyDeck';
import { OtherDeck } from './OtherDeck';
import { Center } from './Center';
import { BoardComponentProps } from '../../../../typings';

export function BigTwoBoard(props: BoardComponentProps) {
  const { isConnected, G, ctx, moves, playerID } = props;
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
        <MyDeck
          deck={player.hand}
          setHand={moves.setHand}
          playCard={moves.playCard}
          pass={moves.pass}
        />
        {opponents.map(({ numOfCards }, index) => (
          <OtherDeck key={index} index={index} numOfCards={numOfCards} />
        ))}
        <Center {...props} />
      </>
    );
  }

  return <div className={`big-two-board ${phase}`.trim()}>{content}</div>;
}
