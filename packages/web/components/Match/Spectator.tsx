import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import router from 'next/router';
import { fromEventPattern } from 'rxjs';
import { Colors, HTMLTable, Icon } from '@blueprintjs/core';
import { ChatEvent, WsError } from '@/typings';
import { useMatch, Player } from '@/hooks/useMatch';
import { Toaster } from '@/utils/toaster';
import { Loading } from './CenterText';
import styles from './Match.module.scss';

interface Props {
  name: string;
  matchID: string;
}

function frommSocketIO<T>(
  socket: typeof Socket,
  event: ChatEvent | 'connect' | 'disconnect' | 'exception'
) {
  return fromEventPattern<T>(
    handler => socket.on(event, handler),
    handler => socket.off(event, handler)
  );
}

export function Spectator({ name, matchID }: Props) {
  const [socket] = useState(() => io.connect('/spectate', { forceNew: true }));
  const [{ players, started, canceled }, dispatch] = useMatch([
    'started',
    'canceled',
    'players'
  ]);

  useEffect(() => {
    const handlePlayerUpdate = (payload: Player[]) => {
      dispatch({ type: 'UpdatePlayer', payload });
    };

    const events = [
      frommSocketIO<Player[]>(socket, ChatEvent.Player).subscribe(
        handlePlayerUpdate
      ),
      frommSocketIO<WsError>(socket, 'exception').subscribe(error => {
        Toaster.failure(error);
      })
    ];

    socket.emit(ChatEvent.Spectate, { name, matchID }, handlePlayerUpdate);

    return () => {
      events.forEach(subscription => subscription.unsubscribe());
    };
  }, [socket, dispatch, name, matchID]);

  useEffect(() => {
    if (canceled) {
      router
        .push(`/lobby/${name}`)
        .then(() => Toaster.info({ message: 'The match has canceled' }));
    }
  }, [name, canceled]);

  if (players.length === 0) {
    return <Loading />;
  }

  if (started) {
    return null;
  }

  return (
    <div className={styles['spectator']}>
      <div className={styles['spectator-title']}>Waiting for players ready</div>
      <HTMLTable bordered>
        <thead>
          <tr>
            <th>Player</th>
            <th>Ready</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, idx) => {
            const player: Partial<Player> = p || {};
            return (
              <tr key={idx}>
                <td>{player.playerName || ' - '}</td>
                <td>
                  {player.ready ? (
                    <Icon icon="tick-circle" color={Colors.GREEN3} />
                  ) : (
                    <Icon icon="circle" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </HTMLTable>
    </div>
  );
}
