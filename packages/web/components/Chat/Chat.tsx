import React, { useEffect } from 'react';
import { Param$JoinChat, Schema$Message } from '@/typings';
import io from 'socket.io-client';

interface ChatProps extends Param$JoinChat {
  onReady?: () => void;
}

export function Chat({ onReady, ...identify }: ChatProps) {
  const payload = JSON.stringify(identify);
  useEffect(() => {
    const identify = JSON.parse(payload);
    console.log('init');
    const socket = io.connect('/chat');
    socket.on('connect', () => {
      console.log('connected');
      socket.emit('Join', identify);
    });

    socket.on('Message', (data: Schema$Message) => {
      console.log('message', data);
    });

    const handler = () => {
      socket.emit('Send', { ...identify, content: new Date() });
    };

    window.addEventListener('click', handler);

    return () => {
      socket.disconnect();
      window.removeEventListener('click', handler);
    };
  }, [payload]);

  return <div></div>;
}
