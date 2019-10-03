import React, { useState, useCallback, useMemo } from 'react';
import { RouteComponentProps, generatePath } from 'react-router-dom';
import { games, gameConfig } from '../../games';
import { useRxAsync } from '../../hooks/useRxAsync';
import { createRoom } from '../../services';
import { PATHS } from '../../constants';

export function Home({ history }: RouteComponentProps) {
  const [selectedGame, selectGame] = useState('');
  const [numPlayers, setNumPlayers] = useState(-1);
  const { maxPlayers = 0, minPlayers = 0 } = useMemo(
    () => gameConfig[selectedGame] || {},
    [selectedGame]
  );

  const req = useCallback(
    () =>
      selectedGame && numPlayers
        ? createRoom({ name: selectedGame, numPlayers }).then(
            res => res.data.gameID
          )
        : Promise.reject(),
    [selectedGame, numPlayers]
  );

  const onSuccess = useCallback(
    (gameID: string) => {
      history.push(
        generatePath(PATHS.ROOM, {
          gameName: selectedGame,
          gameID
        })
      );
    },
    [history, selectedGame]
  );

  const { loading, run } = useRxAsync(req, { defer: true, onSuccess });

  return (
    <div className="home">
      <div>
        <h4>Select a game</h4>
        <div className="row">
          <div>Game:</div>
          <div>
            <select
              name="games"
              value={selectedGame}
              onChange={evt => selectGame(evt.target.value)}
            >
              <option value="" disabled>
                Select a game
              </option>
              {games.map(name => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div>Number of players :</div>
          <div>
            <select
              name="numPlayers"
              value={numPlayers}
              onChange={evt => setNumPlayers(Number(evt.target.value))}
              disabled={selectedGame === ''}
            >
              <option value={-1} disabled>
                ---
              </option>
              {Array.from(
                { length: maxPlayers - minPlayers + 1 },
                (_, index) => (
                  <option value={minPlayers + index} key={index}>
                    {minPlayers + index}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="row">
          <div />
          <div>
            <button disabled={loading} onClick={run}>
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
