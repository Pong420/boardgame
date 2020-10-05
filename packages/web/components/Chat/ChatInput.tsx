import React, { ChangeEvent, useState } from 'react';
import dynamic from 'next/dynamic';
import { PickerProps, BaseEmoji } from 'emoji-mart';
import { Button, Popover } from '@blueprintjs/core';
import { usePreferencesState } from '@/services';
import { Input } from '../Input';
import { Loading } from '../Match/CenterText';
import styles from './Chat.module.scss';

interface Props {
  onSend: (value: string) => void;
}

const Picker = dynamic<PickerProps>(
  () => import('emoji-mart').then(comp => comp.Picker),
  { loading: Loading, ssr: false }
);

const icon = (
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

export function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState('');
  const { theme } = usePreferencesState();
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
          <Picker
            autoFocus
            showPreview={false}
            showSkinTones={false}
            theme={theme}
            color="var(--accent-color)"
            onSelect={(emoji: BaseEmoji) => {
              setValue(value => `${value}${emoji.colons}`);
            }}
          />
        }
      >
        <Button minimal icon={icon}></Button>
      </Popover>
      <Input
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
        rightElement={<Button text="Send" intent="primary" onClick={send} />}
      />
    </form>
  );
}
