import React, { ReactNode } from 'react';
import { Button } from '@blueprintjs/core';
import { MyDeck } from './MyDeck';
import { OtherDeck } from './OtherDeck';
import { Center } from './Center';
import { BigTwoBoardProps } from '../../typings';
import styles from './BigTwoBoard.styles';

export function BigTwoBoard(props: BigTwoBoardProps) {
  const { isConnected, G, ctx, moves, playerID } = props;
  const { players, opponents } = G;
  const { phase, activePlayers, numPlayers } = ctx;
  const player = players[Number(playerID)];
  const isActive =
    !!activePlayers && activePlayers[Number(playerID)] === 'main';
  let content: ReactNode;

  if (!isConnected) {
    content = <div className="disconnected">Connecting ...</div>;
  } else if (phase === 'ready') {
    if (player.ready) {
      content = opponents.length ? (
        <div>
          Waiting for player{' '}
          {opponents
            .filter(({ ready }) => !ready)
            .map(({ id }) => id)
            .join(', ')}{' '}
          ready
        </div>
      ) : (
        'loading...'
      );
    } else {
      content = (
        <Button onClick={() => playerID && moves.ready(playerID)}>Ready</Button>
      );
    }
  } else {
    content = (
      <>
        <MyDeck
          moves={moves}
          deck={player.hand}
          isActive={isActive}
          disablePass={ctx.currentPlayer === G.previous.player}
        />
        {opponents.map(({ numOfCards }, index) => (
          <OtherDeck
            key={index}
            index={numPlayers === 2 ? 1 : index}
            numOfCards={numOfCards}
          />
        ))}
        <Center {...props} isActive={isActive} />
      </>
    );
  }

  return (
    <div className={`big-two-board ${phase}`.trim()}>
      {content}
      <style jsx global>
        {styles}
      </style>
    </div>
  );
}
