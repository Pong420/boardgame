import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import router from 'next/router';
import { fromEventPattern } from 'rxjs';
import { SpectateState } from '@/services';
import { ChatEvent, WsError, Response$Spectate } from '@/typings';
import { Toaster } from '@/utils/toaster';
import { Player, useMatch } from '@/hooks/useMatch';
import { PlayerReadyTable } from './PlayerReadyTable';
import { MatchContent, onGameover } from '../Match';
import { Loading } from '../CenterText';

type Props = SpectateState &
  onGameover & {
    onNextMatch?: (nextMatchID: string) => void;
  };

function frommSocketIO<T>(
  socket: typeof Socket,
  event: ChatEvent | 'connect' | 'disconnect' | 'exception'
) {
  return fromEventPattern<T>(
    handler => socket.on(event, handler),
    handler => socket.off(event, handler)
  );
}

export function SpectatorContent({ onGameover, onNextMatch, ...state }: Props) {
  const { name, matchID } = state;
  const [socket] = useState(() => io.connect('/spectate', { forceNew: true }));
  const [connected, setConnected] = useState(false);
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
      frommSocketIO<WsError>(socket, 'exception').subscribe(error => {
        Toaster.failure(error);
      }),
      frommSocketIO<Player[]>(socket, ChatEvent.Player).subscribe(
        handlePlayerUpdate
      ),
      frommSocketIO<string>(socket, ChatEvent.NextMatch).subscribe(onNextMatch)
    ];

    socket.emit(
      ChatEvent.Spectate,
      { name, matchID },
      ({ players, nextMatchID }: Response$Spectate) => {
        handlePlayerUpdate(players);
        setConnected(true);
        nextMatchID && onNextMatch && onNextMatch(nextMatchID);
      }
    );

    return () => {
      events.forEach(subscription => subscription.unsubscribe());
    };
  }, [socket, dispatch, name, matchID, onNextMatch]);

  useEffect(() => {
    if (canceled) {
      router
        .push(`/lobby/${name}`)
        .then(() => Toaster.info({ message: 'The match has canceled' }));
    }
  }, [name, canceled]);

  if (!connected) {
    return <Loading />;
  }

  if (!started) {
    return <PlayerReadyTable players={players} />;
  }

  return <MatchContent state={state} onGameover={onGameover} />;
}
