import React, { useState } from 'react';
import getAPI from '../api';

export default function Home(props) {
  const [loading, setLoading] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [gameName, setGameName] = useState('big-two');

  function createNewGame() {
    if (gameName) {
      setLoading(true);

      getAPI(gameName)
        .post(`/create`, {
          numPlayers
        })
        .then(response => {
          props.history.push(`/${gameName}/${response.data.gameID}/`);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  return (
    <div className="home">
      {!loading ? (
        <div className="create-new-game">
          <table>
            <tbody>
              <tr>
                <td>Game:</td>
                <td>
                  <select name="game" value={gameName} onChange={evt => setGameName(evt.target.value)}>
                    <option value="big-two">Big Two</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Number of Player:</td>
                <td>
                  <select name="numPlayers" value={numPlayers} onChange={evt => setNumPlayers(evt.target.value)}>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colSpan="2" align="right">
                  <button type="button" onClick={createNewGame}>
                    New game
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="loading">loading ...</div>
      )}
    </div>
  );
}
