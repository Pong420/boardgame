import React from 'react';

import You from '../You';
import Center from '../Center';
import OtherPlayers from '../OtherPlayers';

export default function BigTwoBoard(props) {
  const { phase } = props.ctx;
  const { players, otherPlayers } = props.G;
  const player = players[props.playerID];

  return !props.isConnected ? (
    <div className="disconnected">Connecting ...</div>
  ) : (
    <div className={`big-two-board ${phase}`}>
      {phase === 'ready' ? (
        !player.ready ? (
          <button onClick={() => props.moves.ready(props.playerID)}>Ready</button>
        ) : (
          <div>
            Waiting for Player{' '}
            {otherPlayers
              .filter(({ ready }) => !ready)
              .map(({ id }) => id)
              .join(',')}
          </div>
        )
      ) : (
        <>
          <You cards={player.cards} {...props} />
          <OtherPlayers {...props} />
          <Center {...props} />
        </>
      )}
    </div>
  );
}
