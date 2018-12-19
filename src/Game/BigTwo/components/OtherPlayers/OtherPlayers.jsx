import React from 'react';
import CardBack from '../Card/CardBack';

export default function OtherPlayers(props) {
  return (
    <>
      {props.G.otherPlayers.map((player, playerIdx) => {
        const clasNameForPos = ['left', 'top', 'right'][playerIdx];

        return (
          <div className={`other-player player-${player.id} ${clasNameForPos}`} key={player.id}>
            <div className="grid-container">
              {new Array(player.cards).fill(null).map((_, index) => {
                return <CardBack degree={(playerIdx + 1) * 90} key={index} />;
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
