import React, { useLayoutEffect, useRef } from 'react';
import { fromEvent } from 'rxjs';
import { Icon } from '@blueprintjs/core';
import { useChatDispatch, useChatMessage } from '@/hooks/useChat';
import { MessageStatus, MessageType } from '@/typings';
import styles from './ChatBubble.module.scss';

interface Props {
  className?: string;
  user?: string;
  content: string;
  status?: MessageStatus;
  date?: string;
}

interface ChatBubbleProps {
  id: string;
  playerID: string;
  first?: boolean;
}

const dataFormat = (value: number): string => {
  const d = new Date(value);
  return d.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

function Status({ status }: { status?: MessageStatus }) {
  switch (status) {
    case MessageStatus.PENDING:
      return <Icon icon="more" />;
    case MessageStatus.SUCCESS:
      return <Icon icon="tick" />;
    case MessageStatus.FAILURE:
      return <Icon icon="error" />;
    default:
      return null;
  }
}

const SystemMessage = React.forwardRef<HTMLDivElement, Props>(
  ({ content, date }: Props, ref) => {
    return (
      <div
        ref={ref}
        className={[styles['chat-bubble'], styles['system']]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={styles['chat-bubble-date']}>{date}</div>
        <div className={styles['chat-bubble-content']}>{content}</div>
      </div>
    );
  }
);

const ChatMessage = React.forwardRef<HTMLDivElement, Props>(
  ({ className, user, content, status, date }, ref) => {
    return (
      <div
        ref={ref}
        className={[styles['chat-bubble'], styles['message'], className]
          .filter(Boolean)
          .join(' ')}
      >
        {!!user && <div className={styles['chat-bubble-user']}>{user}</div>}
        <div className={styles['chat-bubble-content']}>
          <div className={styles['chat-bubble-text']}>{content}</div>
          <div className={styles['chat-bubble-date']}>
            {date}
            <Status status={status} />
          </div>
        </div>
      </div>
    );
  }
);

export const ChatBubble = React.memo(
  ({ id, first, playerID }: ChatBubbleProps) => {
    const [msg, unread] = useChatMessage(id);
    const dispatch = useChatDispatch();
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      const el = ref.current;
      const scroller = el && el.parentElement;
      if (unread && el && scroller instanceof HTMLElement) {
        const subscription = fromEvent(scroller, 'scroll').subscribe(() => {
          if (
            scroller.scrollTop + scroller.offsetHeight >=
            el.offsetTop + el.offsetHeight - scroller.offsetTop
          ) {
            dispatch({ type: 'ReadMessage', payload: id });
          }
        });
        return () => subscription.unsubscribe();
      }
    }, [id, unread, dispatch]);

    if (msg) {
      const date = dataFormat(Number(id));
      const { status, ...common } = msg;
      const props: Props = { ...common, date };

      switch (msg.type) {
        case MessageType.SYSTEM:
          return <SystemMessage {...props} ref={ref} />;
        case MessageType.CHAT:
          const self = msg.playerID === playerID;
          return (
            <ChatMessage
              {...props}
              ref={ref}
              user={first && !self ? msg.playerName : undefined}
              status={self ? status : undefined}
              className={[
                first ? styles['first'] : undefined,
                self ? styles['self'] : styles['other']
              ]
                .filter(Boolean)
                .join(' ')}
            />
          );
      }
    }
    return null;
  }
);
