import React from 'react';
import { MyDeck } from './MyDeck';
import { OtherDeck } from './OtherDeck';
import { Center } from './Center';
import { BigTwoBoardProps } from '../../typings';
import styles from './BigTwoBoard.styles';

export function BigTwoBoard(props: BigTwoBoardProps) {
  const { G, ctx, moves, playerID } = props;
  const { players, opponents } = G;
  const { activePlayers, numPlayers } = ctx;
  const player = players[Number(playerID)];
  const isActive =
    !!activePlayers && activePlayers[Number(playerID)] === 'main';

  return (
    <div className="big-two-board">
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
      <style jsx global>
        {styles}
      </style>
    </div>
  );
}
