import React from 'react';
import { Icon } from '@blueprintjs/core';
import { useChatMessage } from '@/hooks/useChat';
import { MessageStatus, MessageType } from '@/typings';
import styles from './ChatBubble.module.scss';

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

interface Props {
  className?: string;
  user?: string;
  content: string;
  status?: MessageStatus;
  date?: string;
}

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

function SystemMessage({ content, date }: Props) {
  return (
    <div
      className={[styles['chat-bubble'], styles['system']]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles['chat-bubble-date']}>{date}</div>
      <div className={styles['chat-bubble-content']}>{content}</div>
    </div>
  );
}

function ChatMessage({ className, user, content, status, date }: Props) {
  return (
    <div
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

export const ChatBubble = React.memo(
  ({ id, first, playerID }: ChatBubbleProps) => {
    const msg = useChatMessage(id);
    if (msg) {
      const date = dataFormat(Number(id));
      const { status, ...common } = msg;
      const self = msg.playerID === playerID;
      const props: Props = { ...common, date };

      switch (msg.type) {
        case MessageType.SYSTEM:
          return <SystemMessage {...props} />;
        case MessageType.CHAT:
          return (
            <ChatMessage
              {...props}
              user={first && !self ? msg.playerName : undefined}
              status={self ? status : undefined}
              className={[
                self ? styles['self'] : styles['other'],
                first ? styles['first'] : undefined
              ]
                .filter(Boolean)
                .join(' ')}
            />
          );
      }
    }
    return <div />;
  }
);
