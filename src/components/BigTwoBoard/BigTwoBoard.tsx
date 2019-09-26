import React, { ReactNode } from 'react';
import { MyDeck } from './MyDeck';
import { OtherDeck } from './OtherDeck';
import { Handler, Context, Moves } from '../../typings';

interface Props {
  isConnected: boolean;
  playerID: string;
  readonly G: Handler;
  readonly ctx: Context;
  readonly moves: Moves;
}

export function BigTwoBoard({ isConnected, G, ctx, moves, playerID, ...reset }: Props) {
  const { players, otherPlayers } = G;
  const { phase } = ctx;
  const player = players[Number(playerID)];

  if (!isConnected) {
    return <div className="disconnected">Connecting ...</div>;
  }

  console.log(moves, reset);

  let content: ReactNode;
  if (phase === 'ready') {
    content = !player.ready ? (
      <button onClick={() => moves.ready(playerID)}>Ready</button>
    ) : (
      <div>
        Waiting for Player{' '}
        {otherPlayers
          .filter(({ ready }) => !ready)
          .map(({ id }) => id)
          .join(',')}
      </div>
    );
  } else {
    content = (
      <>
        <MyDeck deck={player.cards} />
        {otherPlayers.map(({ cards }, index) => (
          <OtherDeck key={index} numOfCards={cards} index={index} />
        ))}
      </>
    );
  }

  return <div className={`big-two-board ${phase}`.trim()}>{content}</div>;
}
