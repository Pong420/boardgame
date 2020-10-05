import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { EmojiProps } from 'emoji-mart';
import styles from './ChatBubble.module.scss';

const colons = `:[a-zA-Z0-9-_+]+:`;
const skin = `:skin-tone-[2-6]:`;
const colonsRegex = new RegExp(`(${colons}${skin}|${colons})`, 'g');

const Emoji = dynamic<EmojiProps>(
  () =>
    import(/* webpackChunkName: "emoji-mart" */ 'emoji-mart').then(
      ({ Emoji }) => Emoji
    ),
  { ssr: false }
);

interface Props {
  content: string;
}

export function TextContent({ content }: Props) {
  const [value] = useState(content.split(colonsRegex));

  return (
    <div className={styles['chat-bubble-text']}>
      {value.map(
        (emoji, idx) =>
          !!emoji && (
            <Emoji
              size={24}
              key={idx}
              emoji={emoji}
              fallback={() => emoji as any}
            />
          )
      )}
    </div>
  );
}
