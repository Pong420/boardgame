import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Card, Icon } from '@blueprintjs/core';
import { Param$JoinChat, Schema$Message, ChatEvent } from '@/typings';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { ChatProvider, useChat } from '@/hooks/useChat';
import { MessageStatus, MessageType } from '@/typings';
import { fromEventPattern } from 'rxjs';
import { ChatInput } from './ChatInput';
import { ChatBubble } from './ChatBubble';
import styles from './Chat.module.scss';
import io, { Socket } from 'socket.io-client';
import { useBoolean } from '@/hooks/useBoolean';

interface ChatProps extends Param$JoinChat {
  onReady?: () => void;
}

function frommSocketIO<T>(
  socket: typeof Socket,
  event: ChatEvent | 'connect' | 'disconnect'
) {
  return fromEventPattern<T>(
    handler => socket.on(event, handler),
    handler => socket.off(event, handler)
  );
}

function fromMessage(socket: typeof Socket) {
  return frommSocketIO<Schema$Message>(socket, ChatEvent.Message);
}

function ChatContent({ onReady, ...identify }: ChatProps) {
  const identifyRef = useRef(identify);
  const [socket] = useState(() => io.connect('/chat'));
  const [chatState, dispatch] = useChat();
  const [{ autoScroll, scrollToBottom }, contentElRef] = useScrollToBottom();
  const [collapsed, , , toggleCollapse] = useBoolean(false);

  const { sendMessage } = useMemo(() => {
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
      socket.emit(ChatEvent.Ready, identify);
    };

    return {
      scrollToBottom,
      sendMessage,
      toggleReady
    };
  }, [socket, dispatch, scrollToBottom]);

  useEffect(() => {
    const events = [
      frommSocketIO(socket, 'connect').subscribe(() =>
        socket.emit(ChatEvent.Join, identifyRef.current)
      ),
      fromMessage(socket).subscribe(payload =>
        dispatch({ type: 'Create', payload })
      )
    ];

    return () => {
      socket.disconnect();
      events.forEach(subscription => subscription.unsubscribe());
    };
  }, [socket, dispatch]);

  useEffect(() => {
    autoScroll && setTimeout(scrollToBottom, 0);
  }, [chatState, autoScroll, scrollToBottom]);

  return (
    <Card
      className={[
        styles.chat,
        // styles['full-screen']
        styles['bottom-right'],
        collapsed && styles['collapsed']
      ]
        .filter(Boolean)
        .join(' ')}
      elevation={2}
    >
      <div className={styles['chat-header']} onClick={toggleCollapse}>
        <div className={styles['chat-header-title']}>Chat</div>
        <div>
          <Icon icon={collapsed ? 'chevron-up' : 'chevron-down'} />
        </div>
      </div>
      <div className={styles['chat-content']} ref={contentElRef}>
        {chatState.group.map(ids => (
          <Fragment key={ids[0]}>
            {ids.map((id, idx) => (
              <ChatBubble
                id={id}
                key={id}
                playerID={identify.playerID}
                first={idx === 0}
                user={idx === 0 ? `Player ${identify.playerID}` : undefined}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div className={styles['chat-footer']}>
        <ChatInput onSend={sendMessage} />
      </div>
    </Card>
  );
}

export function Chat(props: ChatProps) {
  return (
    <ChatProvider>
      <ChatContent {...props} />
    </ChatProvider>
  );
}
