import React from 'react';
import { defer, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { HTMLSelect } from '@blueprintjs/core';
import { createForm, FormProps, validators, FormItemProps } from '@/utils/form';
import { Toaster } from '@/utils/toaster';
import { Params$CreateMatch, GameMeta } from '@/typings';
import {
  gotoMatch,
  createMatch,
  joinMatch,
  usePreferences,
  matchStorage,
  MultiMatchState
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
  meta: GameMeta;
}

interface Props extends Create, ButtonPopoverProps {}

const { Form, FormItem, useForm } = createForm<Store>();

function createAndJoinMatch({ playerName, local, name, ...reset }: Store) {
  return defer(() => createMatch({ name, ...reset })).pipe(
    catchError(error => {
      Toaster.apiError('Create Match Failure', error);
      return throwError(error);
    }),
    switchMap(response => {
      const { matchID } = response.data;
      return defer(() =>
        joinMatch({ name, matchID, playerName, playerID: '0' })
      ).pipe(
        map(join => ({ matchID, credentials: join.data.playerCredentials })),
        catchError(error => {
          Toaster.apiError('Join Match Failure', error);
          return throwError(error);
        })
      );
    })
  );
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

export function CreateMatch({ meta, ...props }: Props) {
  const [form] = useForm();
  const [{ playerName }, updatePrefrences] = usePreferences();
  const { name, gameName, numPlayers } = meta;

  async function onConfirm() {
    const store = await form.validateFields();
    if (store.local) {
      await gotoMatch({
        ...store,
        matchName: 'local',
        local: true,
        gameMeta: meta
      });
    } else if (store.setupData) {
      const { matchName } = store.setupData;
      const payload = await createAndJoinMatch(store).toPromise();
      const state: MultiMatchState = {
        ...payload,
        name,
        matchName,
        playerID: '0',
        gameMeta: meta,
        numPlayers: store.numPlayers
      };
      await gotoMatch(state);
      matchStorage.save(state);
    } else {
      throw new Error('Incorrct form state');
    }
  }

  return (
    <ButtonPopover
      {...props}
      onClick={() =>
        openConfirmDialog({
          title: `Create ${gameName} Match`,
          onConfirm,
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
