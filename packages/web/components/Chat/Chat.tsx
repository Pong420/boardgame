import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card } from '@blueprintjs/core';
import { Param$JoinChat, Schema$Message, ChatEvent } from '@/typings';
import { createUseCRUDReducer } from '@/hooks/crud-reducer';
import { MessageStatus, MessageType } from '@/typings';
import { fromEvent, fromEventPattern } from 'rxjs';
import { ChatInput } from './ChatInput';
import styles from './Chat.module.scss';
import io, { Socket } from 'socket.io-client';

interface ChatProps extends Param$JoinChat {
  onReady?: () => void;
}

const useMessageReducer = createUseCRUDReducer<Schema$Message, 'id'>('id', {
  prefill: false
});

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

export function Chat({ onReady, ...identify }: ChatProps) {
  const identifyRef = useRef(identify);
  const socketRef = useRef(io.connect('/chat'));
  const contentRef = useRef<HTMLDivElement>(null);
  const [state, actions] = useMessageReducer();
  const [autoScroll, setAutoScroll] = useState(true);
  const messageIds = state.ids;

  const { scrollToBottom, sendMessage, toggleReady } = useMemo(() => {
    const socket = socketRef.current;
    const identify = identifyRef.current;

    const scrollToBottom = () => {
      const contentEl = contentRef.current;
      if (contentEl) {
        contentEl.scrollTop = contentEl.scrollHeight;
      }
    };

    const sendMessage = (content: string) => {
      const message: Schema$Message = {
        ...identify,
        content,
        id: String(+new Date()),
        type: MessageType.CHAT,
        status: MessageStatus.PENDING
      };

      actions.create(message);

      socket.emit(ChatEvent.Send, message, () => {
        actions.update({ ...message, status: MessageStatus.SUCCESS });
      });

      scrollToBottom();
    };

    const toggleReady = () => {
      socket.emit(ChatEvent.Ready, identify);
    };

    return {
      scrollToBottom,
      sendMessage,
      toggleReady
    };
  }, [actions]);

  useEffect(() => {
    const socket = socketRef.current;
    const subscription = frommSocketIO(socket, 'connect').subscribe(() =>
      socket.emit(ChatEvent.Join, identifyRef.current)
    );
    return () => {
      socket.disconnect();
      subscription.unsubscribe();
    };
  }, [actions]);

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      scrollToBottom();
      const subscription = fromEvent(content, 'scroll').subscribe(() => {
        setAutoScroll(
          content.scrollTop >= content.scrollHeight - content.offsetHeight
        );
      });
      return () => subscription.unsubscribe();
    }
  }, [scrollToBottom]);

  useEffect(() => {
    const subscription = fromMessage(socketRef.current).subscribe(message => {
      actions.create(message);
      setTimeout(() => {
        autoScroll && scrollToBottom();
      }, 0);
    });
    return () => subscription.unsubscribe();
  }, [actions, autoScroll, scrollToBottom]);

  return (
    <Card
      className={[
        //
        styles.chat,
        // styles['full-screen']
        styles['bottom-right']
      ].join(' ')}
      elevation={2}
    >
      <div className={styles['chat-header']}>
        <div className={styles['chat-header-title']}>Chat</div>
        <div>
          <Button minimal icon="chevron-up" />
        </div>
      </div>
      <div className={styles['chat-content']} ref={contentRef}>
        {state.list.map(msg => (
          <ChatBubble
            {...msg}
            key={msg.id}
            self={identifyRef.current.playerID === msg.playerID}
          />
        ))}
      </div>
      <div className={styles['chat-footer']}>
        <ChatInput onSend={sendMessage} />
      </div>
    </Card>
  );
}

interface ChatBubbleProps extends Schema$Message {
  self: boolean;
}

function ChatBubble({ type, content, self }: ChatBubbleProps) {
  const isSystemMessage = type === MessageType.SYSTEM;
  return (
    <div
      className={[
        styles['chat-bubble'],
        self && styles['self'],
        isSystemMessage && styles['system']
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {content}
    </div>
  );
}
