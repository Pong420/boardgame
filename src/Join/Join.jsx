import React, { useState } from 'react';
import urljoin from 'url-join';
import getAPI from '../api';

export default function Join(props) {
  const { playerID, credentials } = props;
  const { gameName, gameID } = props;
  const [playerName, setPlayerName] = useState(randomID());
  const [status, setStatus] = useState('');

  const api = getAPI(gameName);

  async function getPlayers() {
    const response = await api.get('');
    const game = response.data.gameInstances.find(game => {
      return game.gameID === gameID;
    });

    return game.players;
  }

  async function join(evt) {
    evt.preventDefault();

    const player = (await getPlayers()).find(player => !player.hasOwnProperty('name'));

    if (player) {
      setStatus('loading');

      try {
        const playerID = String(player.id);
        const response = await api.post(`/${gameID}/join`, {
          gameName,
          playerID,
          playerName
        });

        setStatus('success');

        props.history.push(urljoin(playerID, response.data.playerCredentials));
      } catch (err) {
        console.log(err);
        setStatus('retry');
      }
    } else {
      setStatus('full');
    }
  }

  return (
    <div className="join">
      {playerID && credentials ? (
        props.children(playerName)
      ) : status === 'loading' ? (
        <pre>Loading ...</pre>
      ) : status === 'retry' ? (
        <button onClick={join}>retry</button>
      ) : status === 'full' ? (
        <pre>full</pre>
      ) : (
        <form onSubmit={join}>
          <input
            hidden
            type="text"
            name="name"
            placeholder="Type your name"
            value={playerName}
            onChange={evt => setPlayerName(evt.target.value)}
          />
          <pre>Inviate other players by sharing this url</pre>
          <pre>{window.location.href}</pre>
          <button type="submit">Join</button>
        </form>
      )}
    </div>
  );
}

// Generate random string characters
// Reference
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/19964557#19964557
function randomID(N = 5) {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.apply(null, Array(N))
    .map(() => s.charAt(Math.floor(Math.random() * s.length)))
    .join('');
}
