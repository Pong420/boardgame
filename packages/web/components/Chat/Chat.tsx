import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { fromEventPattern } from 'rxjs';
import { Card, Icon } from '@blueprintjs/core';
import {
  Param$JoinChat,
  Schema$Message,
  ChatEvent,
  MessageStatus,
  MessageType,
  WS$Player
} from '@/typings';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { useChat } from '@/hooks/useChat';
import { useBoolean } from '@/hooks/useBoolean';
import { ChatInput } from './ChatInput';
import { ChatBubble } from './ChatBubble';
import { UnreadCount } from './UnreadCount';
import { Disconnected } from '../Match';
import { ReadyButton } from '../ReadyButton';
import styles from './Chat.module.scss';

interface ChatProps extends Param$JoinChat {}

function frommSocketIO<T>(
  socket: typeof Socket,
  event: ChatEvent | 'connect' | 'disconnect'
) {
  return fromEventPattern<T>(
    handler => socket.on(event, handler),
    handler => socket.off(event, handler)
  );
}

function ChatContent(identify: ChatProps) {
  const identifyRef = useRef(identify);
  const [{ group, unread, started }, dispatch] = useChat();
  const [collapsed, , , toggleCollapse] = useBoolean(true);
  const [connected, setConnected] = useState(false);
  const [{ autoScroll, scrollToBottom }, contentElRef] = useScrollToBottom(
    connected
  );
  const [socket] = useState(() => io.connect('/chat', { query: identify }));

  const { sendMessage, toggleReady } = useMemo(() => {
    const identify = identifyRef.current;

    const sendMessage = (content: string) => {
      const message: Schema$Message = {
        ...identify,
        content,
        id: String(+new Date()),
        type: MessageType.CHAT,
        status: MessageStatus.PENDING
      };

      dispatch({ type: 'Create', payload: message });

      socket.emit(ChatEvent.Send, message, () => {
        dispatch({
          type: 'Update',
          payload: { ...message, status: MessageStatus.SUCCESS }
        });
      });

      setTimeout(scrollToBottom, 0);
    };

    const toggleReady = () => {
      socket.emit(ChatEvent.Ready, identify, (payload: string[]) => {
        dispatch({ type: 'Ready', payload });
      });
    };

    return {
      sendMessage,
      toggleReady
    };
  }, [socket, dispatch, scrollToBottom]);

  useEffect(() => {
    const identify = identifyRef.current;
    const events = [
      frommSocketIO(socket, 'connect').subscribe(() => {
        socket.emit(ChatEvent.Join, identify);
        setConnected(true);
      }),
      frommSocketIO(socket, 'disconnect').subscribe(() => {
        setConnected(false);
      }),
      frommSocketIO<string[]>(socket, ChatEvent.Ready).subscribe(payload => {
        dispatch({ type: 'Ready', payload });
      }),
      frommSocketIO<(WS$Player | null)[]>(
        socket,
        ChatEvent.Player
      ).subscribe(payload => dispatch({ type: 'UpdatePlayer', payload })),
      frommSocketIO<Schema$Message>(
        socket,
        ChatEvent.Message
      ).subscribe(payload => dispatch({ type: 'Create', payload }))
    ];

    socket.disconnected && socket.open();

    return () => {
      socket.emit(ChatEvent.Leave, identify);
      // disable for development ?
      socket.disconnected && socket.disconnect();
      events.forEach(subscription => subscription.unsubscribe());
    };
  }, [socket, dispatch]);

  useEffect(() => {
    autoScroll && !collapsed && setTimeout(scrollToBottom, 0);
  }, [
    group,
    autoScroll,
    scrollToBottom,
    collapsed,
    // for change from full-screen to bottom-right
    started
  ]);

  return (
    <Card
      className={[
        styles.chat,
        started ? styles['bottom-right'] : styles['full-screen'],
        collapsed && styles['collapsed']
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles['chat-header']} onClick={toggleCollapse}>
        <div className={styles['chat-header-title']}>
          Chat <UnreadCount count={unread.length} />
        </div>
        <div>
          <Icon icon={collapsed ? 'chevron-up' : 'chevron-down'} />
        </div>
      </div>
      {connected ? (
        <>
          <div className={styles['chat-content']} ref={contentElRef}>
            {group.map(ids => (
              <Fragment key={ids[0]}>
                {ids.map((id, idx) => (
                  <ChatBubble
                    id={id}
                    key={id}
                    first={idx === 0}
                    playerID={identify.playerID}
                  />
                ))}
              </Fragment>
            ))}
          </div>
          <div className={styles['chat-footer']}>
            <ChatInput onSend={sendMessage} />
            {!started && (
              <ReadyButton
                playerID={identify.playerID}
                toggleReady={toggleReady}
              />
            )}
          </div>
        </>
      ) : (
        <Disconnected />
      )}
    </Card>
  );
}

export function Chat(props: ChatProps) {
  return <ChatContent {...props} />;
}
