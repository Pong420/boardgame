import React from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { createForm, FormProps, validators, FormItemProps } from '@/utils/form';
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
  numPlayers: number[];
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

function HiddenIfLocal(props: FormItemProps<Store>) {
  return (
    <FormItem deps={['local']} noStyle>
      {({ local }) => (local ? <div /> : <FormItem {...props} />)}
    </FormItem>
  );
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
      <FormItem name="local" valuePropName="checked">
        <Checkbox>Local</Checkbox>
      </FormItem>

      <HiddenIfLocal
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
      </HiddenIfLocal>

      <HiddenIfLocal
        label="Match Name"
        name={['setupData', 'matchName']}
        validators={[
          validators.required('Please input the match name'),
          validators.maxLength(10, 'Match name cannot longer than 10')
        ]}
      >
        <Input />
      </HiddenIfLocal>

      <FormItem
        label="Number of Players"
        name="numPlayers"
        normalize={Number}
        validators={[validators.required('Please select number of players')]}
      >
        <HTMLSelect fill options={numPlayersOps} />
      </FormItem>

      <HiddenIfLocal
        label="Description ( Optional )"
        name={['setupData', 'description']}
        validators={[
          validators.maxLength(50, 'Description name cannot longer than 50')
        ]}
      >
        <TextArea />
      </HiddenIfLocal>

      <FormItem name="name" noStyle>
        <div hidden />
      </FormItem>
    </Form>
  );
}

export function CreateMatch({ name, numPlayers, gameName, ...props }: Props) {
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
            if (store.local) {
              await gotoMatch({
                ...store,
                gameName,
                local: true,
                matchName: 'Local'
              });
            } else {
              const payload = await createAndJoinMatch({
                ...store,
                setupData: {
                  ...store.setupData!,
                  numPlayers: store.numPlayers
                }
              });
              const state = {
                ...payload,
                name,
                gameName,
                playerID: '0',
                numPlayers: store.numPlayers,
                matchName: store.setupData!.matchName
              };
              await gotoMatch(state);
              matchStorage.save(state);
            }
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
                numPlayers.length === 2
                  ? Array.from(
                      { length: numPlayers[1] - numPlayers[0] + 1 },
                      (_, idx) => numPlayers[0] + idx
                    )
                  : numPlayers
              }
            />
          )
        })
      }
    />
  );
}
