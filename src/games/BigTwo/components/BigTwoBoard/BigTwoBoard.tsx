import React, { ReactNode } from 'react';
import { MyDeck } from './MyDeck';
import { OtherDeck } from './OtherDeck';
import { Center } from './Center';
import { State, BoardComponentProps } from '../../typings';

export function BigTwoBoard(props: BoardComponentProps<State>) {
  const { isConnected, G, ctx, moves, playerID } = props;
  const { players, opponents } = G;
  const { phase, activePlayers, numPlayers } = ctx;
  const player = players[Number(playerID)];
  const isActive =
    !!activePlayers && activePlayers[Number(playerID)] === 'main';

  if (!isConnected) {
    return <div className="disconnected">Connecting ...</div>;
  }

  let content: ReactNode;

  if (phase === 'ready') {
    if (player.ready) {
      content = opponents.length ? (
        <div>
          Waiting for Player{' '}
          {opponents
            .filter(({ ready }) => !ready)
            .map(({ id }) => id)
            .join(',')}
        </div>
      ) : (
        'loading...'
      );
    } else {
      content = <button onClick={() => moves.ready(playerID)}>Ready</button>;
    }
  } else {
    content = (
      <>
        <MyDeck
          isActive={isActive}
          deck={player.hand}
          setHand={moves.setHand}
          playCard={moves.playCard}
          pass={moves.pass}
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

  return <div className={`big-two-board ${phase}`.trim()}>{content}</div>;
}
