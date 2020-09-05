import React, { useCallback } from 'react';
import { Button } from '@blueprintjs/core';
import { useRxAsync } from 'use-rx-hooks';
import { joinMatch } from '../../services';
import { Params$JoinMatch } from '../../typings';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { createForm, validators } from '../../utils/form';
import { Input } from '../../components/Input';
import { PlayerName } from '../../utils/playerName';
import { useHistory } from 'react-router-dom';
import { PATHS } from '../../constants';
import { AxiosResponse } from 'axios';
import { PlaygroundRouteState } from '../Playground';

interface Props extends Omit<Params$JoinMatch, 'playerName'> {}

type Store = { playerName: string };

const { Form, FormItem, useForm } = createForm<Store>();

export function JoinMatch({ name, matchID, playerID }: Props) {
  const history = useHistory();
  const onSuccess = useCallback(
    (res: AxiosResponse<{ playerCredentials: string }>) => {
      history.push(PATHS.PLAYGROUND, {
        name,
        playerID,
        credentials: res.data.playerCredentials
      } as PlaygroundRouteState);
    },
    [name, playerID, history]
  );
  const [form] = useForm();
  const [{ loading }, { fetch }] = useRxAsync(joinMatch, {
    defer: true,
    onSuccess
  });

  return (
    <Button
      loading={loading}
      onClick={() => {
        const playerName = PlayerName.get();
        const join = (playerName: string) =>
          fetch({ name, matchID, playerID, playerName });
        return playerName
          ? join(playerName)
          : openConfirmDialog({
              title: 'Fill your name',
              onConfirm: () =>
                form
                  .validateFields()
                  .then(({ playerName }) => join(playerName)),
              children: (
                <Form form={form}>
                  <FormItem
                    name="playerName"
                    validators={[validators.required('Plase input your name')]}
                  >
                    <Input />
                  </FormItem>
                </Form>
              )
            });
      }}
    >
      Join
    </Button>
  );
}
