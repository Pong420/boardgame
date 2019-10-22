import React, { useCallback } from 'react';
import { RouteComponentProps, generatePath } from 'react-router-dom';
import { Client } from 'boardgame.io/react';
import { useRxAsync } from 'use-rx-hooks';
import { gameConfig } from '../../games';
import { getGame, joinRoom } from '../../services';
import { PATHS, server } from '../../constants';

interface MatchParams {
  gameName: string;
  gameID: string;
  playerID?: string;
  credentials?: string;
}

function Join({
  gameID,
  gameName,
  onSuccess
}: Pick<MatchParams, 'gameName' | 'gameID'> & {
  onSuccess: (p: Required<MatchParams>) => void;
}) {
  const req = useCallback(async () => {
    const {
      data: { roomID, players }
    } = await getGame({ gameID, name: gameName });

    const player = players.find(player => !player.hasOwnProperty('name'));

    if (player) {
      try {
        const res = await joinRoom({
          name: gameName,
          roomID,
          playerID: player.id,
          playerName: String(Math.random())
        });

        const result: Required<MatchParams> = {
          gameName,
          gameID,
          playerID: String(player.id),
          credentials: res.data.playerCredentials
        };

        return result;
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error('full');
    }
  }, [gameID, gameName]);

  const { run } = useRxAsync(req, { defer: true, onSuccess });

  return (
    <div className="inviate">
      <div>
        <pre>Inviate other players by sharing this url</pre>
        <pre>{window.location.href}</pre>
        <button onClick={run}>Join</button>
      </div>
    </div>
  );
}

export function Room({ match, history }: RouteComponentProps<MatchParams>) {
  const { playerID, credentials, gameName, gameID } = match.params;
  const config = gameConfig[gameName];

  const onSuccess = useCallback(
    (params: Required<MatchParams>) => {
      history.push(generatePath(PATHS.ROOM, params));
    },
    [history]
  );

  if (config) {
    if (playerID && credentials) {
      const { game, board } = config;
      const ClientComponent = Client({
        debug: false,
        game,
        board,
        multiplayer: {
          server
        }
      });

      return (
        <ClientComponent
          gameID={gameID}
          playerID={playerID}
          credentials={credentials}
          playerName={`${gameID}/${playerID}`}
        />
      );
    }

    return <Join gameID={gameID} gameName={gameName} onSuccess={onSuccess} />;
  }

  return <div>Game Not Found</div>;
}
