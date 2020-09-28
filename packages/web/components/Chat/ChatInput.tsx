import React, { ChangeEvent, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { Input } from '../Input';
import styles from './Chat.module.scss';

interface Props {
  onSend: (value: string) => void;
}

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
