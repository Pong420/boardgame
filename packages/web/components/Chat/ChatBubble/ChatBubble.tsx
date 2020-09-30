import React, { useLayoutEffect, useRef } from 'react';
import { fromEvent } from 'rxjs';
import { startWith, delay } from 'rxjs/operators';
import { Icon, Colors } from '@blueprintjs/core';
import { useMatchDispatch, useChatMessage } from '@/hooks/useMatch';
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
  readyMsgDeps?: unknown;
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
      return <Icon icon="tick" color={Colors.GREEN3} />;
    case MessageStatus.FAILURE:
      return <Icon icon="error" color={Colors.RED3} />;
    default:
      return null;
  }
}

// https://stackoverflow.com/a/21627295
function visibleY(el: any) {
  let rect = el.getBoundingClientRect();
  const top = rect.top,
    height = rect.height;

  el = el.parentNode;
  // Check if bottom of the element is off the page
  if (rect.bottom < 0) return false;
  // Check its within the document viewport
  if (top > document.documentElement.clientHeight) return false;
  do {
    rect = el.getBoundingClientRect();
    const temp = top <= rect.bottom;
    if (temp === false) return false;
    // Check if the element is out of view due to a container scrolling
    if (top + height <= rect.top) return false;
    el = el.parentNode;
  } while (el !== document.body);
  return true;
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
  ({ id, first, playerID, readyMsgDeps }: ChatBubbleProps) => {
    const [msg, unread] = useChatMessage(id);
    const dispatch = useMatchDispatch();
    const ref = useRef<HTMLDivElement>(null);
    const self = msg?.type === MessageType.CHAT && msg.playerID === playerID;

    useLayoutEffect(() => {
      const el = ref.current;
      const scroller = el && el.parentElement;
      if (unread && el && scroller instanceof HTMLElement) {
        const read = () => dispatch({ type: 'ReadMessage', payload: id });
        if (self) {
          read();
        } else {
          const subscription = fromEvent(scroller, 'scroll')
            .pipe(
              startWith(null),
              delay(300) // wait for chat container shown
            )
            .subscribe(() => visibleY(el) && read());
          return () => subscription.unsubscribe();
        }
      }
    }, [id, unread, dispatch, self, readyMsgDeps]);

    if (msg) {
      const date = dataFormat(Number(id));
      const { status, ...common } = msg;
      const props: Props = { ...common, date };

      switch (msg.type) {
        case MessageType.SYSTEM:
          return <SystemMessage {...props} ref={ref} />;
        case MessageType.CHAT:
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
