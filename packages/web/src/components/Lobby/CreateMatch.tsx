import React from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { createForm, FormProps, validators } from '@/utils/form';
import { Params$CreateMatch } from '@/typings';
import {
  gotoMatch,
  createMatch,
  joinMatch,
  usePreferences,
  matchStorage
} from '@/services';
import { Input, TextArea, Checkbox } from '../Input';
import { ButtonPopover, ButtonPopoverProps } from '../ButtonPopover';
import { openConfirmDialog } from '../ConfirmDialog';
import { PlayerNameControl } from '../PlayerNameControl';

interface Store extends Params$CreateMatch {
  playerName: string;
  local?: boolean;
}

export interface Create {
  name: string;
  gameName: string;
  numOfPlayers: number[];
}

interface Props extends Create, ButtonPopoverProps {}

const { Form, FormItem, useForm } = createForm<Store>();

async function createAndJoinMatch({
  playerName,
  local,
  name,
  ...reset
}: Store) {
  const create = await createMatch({ name, ...reset });
  const { matchID } = create.data;
  const join = await joinMatch({ name, matchID, playerName, playerID: '0' });
  return {
    matchID,
    credentials: join.data.playerCredentials
  };
}

function CreateMatchForm({
  numPlayersOps,
  initialValues,
  ...props
}: FormProps<Store> & { numPlayersOps: number[] }) {
  return (
    <Form
      {...props}
      initialValues={{
        ...initialValues,
        numPlayers: numPlayersOps[0]
      }}
    >
      <FormItem
        label="Your Name"
        name="playerName"
        validators={[validators.required('Please input your name')]}
      >
        <PlayerNameControl
          fill
          alignText="left"
          rightIcon="edit"
          placehodler="Click to type your name"
        />
      </FormItem>

      <FormItem
        label="Match Name"
        name={['setupData', 'matchName']}
        validators={[
          validators.required('Please input the match name'),
          validators.maxLength(10, 'Match name cannot longer than 10')
        ]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="Number of Players"
        name={['numPlayers']}
        validators={[validators.required('Please select number of players')]}
      >
        <HTMLSelect fill options={numPlayersOps} />
      </FormItem>

      <FormItem
        label="Description ( Optional )"
        name={['setupData', 'description']}
        validators={[
          validators.maxLength(50, 'Description name cannot longer than 50')
        ]}
      >
        <TextArea />
      </FormItem>

      <FormItem name={['local']} valuePropName="checked">
        <Checkbox>Local</Checkbox>
      </FormItem>
    </Form>
  );
}

export function CreateMatch({ name, gameName, numOfPlayers, ...props }: Props) {
  const [form] = useForm();
  const [{ playerName }, updatePrefrences] = usePreferences();

  return (
    <ButtonPopover
      {...props}
      onClick={() =>
        openConfirmDialog({
          title: `Create ${gameName} Match`,
          onConfirm: async () => {
            const store = await form.validateFields();
            const payload = await createAndJoinMatch({
              ...store,
              name,
              setupData: {
                ...store.setupData!,
                numOfPlayers: store.numPlayers
              }
            });
            const state = { ...payload, playerID: '0', name };
            await gotoMatch(state);
            matchStorage.save(state);
          },
          children: (
            <CreateMatchForm
              form={form}
              initialValues={{ name, playerName }}
              onValuesChange={({ playerName }) =>
                typeof playerName !== 'undefined' &&
                updatePrefrences(state => ({ ...state, playerName }))
              }
              numPlayersOps={
                numOfPlayers.length === 2
                  ? Array.from(
                      { length: numOfPlayers[1] - numOfPlayers[0] + 1 },
                      (_, idx) => numOfPlayers[0] + idx
                    )
                  : numOfPlayers
              }
            />
          )
        })
      }
    />
  );
}
