import React, { useState, useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Username } from './Username';
import { useUsername } from '../../hooks/useUsername';
import { getAllGames, getAllRoom } from '../../services';

const wrappedGetAllGames = () => getAllGames().then(res => res.data);

interface Props {
  gameList?: string[];
}

function Content({ gameList }: Props) {
  const { username, setUsername } = useUsername();
  const [selectedGame, selectGame] = useState('');

  const getAllRoomCallback = useCallback(
    () =>
      selectedGame
        ? getAllRoom({ name: selectedGame }).then(res => res.data.rooms)
        : Promise.resolve([]),
    [selectedGame]
  );

  const { data: roomList } = useRxAsync(getAllRoomCallback, {});

  if (username) {
    if (gameList) {
      return (
        <div>
          <h4>Select a game</h4>
          <div>
            <div>
              <select
                value={selectedGame}
                onChange={evt => selectGame(evt.target.value)}
              >
                <option value="" disabled>
                  Select a game
                </option>
                {gameList.map((gameName, index) => (
                  <option key={index} value={gameName}>
                    {gameName}
                  </option>
                ))}
              </select>
            </div>
            {selectedGame && (
              <div>
                <button>Create New Room</button>
                {roomList &&
                  roomList.map(({ gameID }) => (
                    <div key={gameID}>
                      {gameID}
                      <button>Join</button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  }

  return <Username initialValue={username} onSubmit={setUsername} />;
}

export function Home() {
  const { data: gameList } = useRxAsync(wrappedGetAllGames);

  return (
    <div className="home">
      <Content gameList={gameList} />
    </div>
  );
}
