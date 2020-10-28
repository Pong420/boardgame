import React, { ChangeEvent, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Popover } from '@blueprintjs/core';
import { Loading } from '../Match/CenterText';
import { Input } from '../Input';
import type { EmojiPickerProps } from './EmojiPicker';
import styles from './Chat.module.scss';

interface Props {
  onSend: (value: string) => void;
}

export const emojiSvgIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
  >
    <path
      fill="currentColor"
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10"
    ></path>
    <path
      fill="currentColor"
      d="M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0"
    ></path>
  </svg>
);

const EmojiPicker = dynamic<EmojiPickerProps>(
  () =>
    import(/* webpackChunkName: "emoji-picker" */ './EmojiPicker').then(
      ({ EmojiPicker }) => EmojiPicker
    ),
  { loading: Loading, ssr: false }
);

export function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState('');
  const send = () => {
    if (value) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <form
      className={styles['chat-input']}
      onSubmit={event => {
        event.preventDefault();
        send();
      }}
    >
      <Popover
        popoverClassName={styles['emoji-popover']}
        content={
          <EmojiPicker
            onSelect={emoji => {
              setValue(value => `${value}${emoji.colons}`);
            }}
          />
        }
      >
        <Button icon={emojiSvgIcon} minimal />
      </Popover>
      <Input
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />
      <Button text="Send" intent="primary" onClick={send} />
    </form>
  );
}
