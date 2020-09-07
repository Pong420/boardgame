import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { joinMatch, PlayerName, PlayerNameValidators } from '@/services';
import { Params$JoinMatch } from '@/typings';
import { createForm, FormProps } from '@/utils/form';
import { Input } from '../Input';
import { openConfirmDialog } from '../ConfirmDialog';

interface Props extends Omit<Params$JoinMatch, 'playerName'> {}

interface Store {
  playerName: string;
}

const { Form, FormItem, useForm } = createForm<Store>();

function PlayerNameForm(props: FormProps<Store>) {
  return (
    <Form
      {...props}
      onValuesChange={({ playerName }) =>
        typeof playerName !== 'undefined' && PlayerName.save(playerName)
      }
    >
      <FormItem
        label="Your Name"
        name="playerName"
        validators={PlayerNameValidators}
      >
        <Input />
      </FormItem>
    </Form>
  );
}

export function JoinMatch(params: Props) {
  const [form] = useForm();
  const [{ loading }, { fetch }] = useRxAsync(joinMatch, { defer: true });

  function handleJoinMatch() {
    const playerName = PlayerName.get();

    if (playerName) {
      fetch({ ...params, playerName });
    } else {
      openConfirmDialog({
        title: 'Player Name',
        children: <PlayerNameForm form={form} />,
        onConfirm: () =>
          form
            .validateFields()
            .then(({ playerName }) => joinMatch({ playerName, ...params }))
      });
    }
  }

  return (
    <Button
      small
      intent="primary"
      text="Join"
      loading={loading}
      onClick={handleJoinMatch}
    />
  );
}
