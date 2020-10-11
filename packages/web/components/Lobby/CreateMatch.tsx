import React from 'react';
import { defer, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { HTMLSelect } from '@blueprintjs/core';
import { createForm, FormProps, validators, FormItemProps } from '@/utils/form';
import { Toaster } from '@/utils/toaster';
import { Param$CreateMatch, GameMeta } from '@/typings';
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

interface Store extends Param$CreateMatch {
  playerName: string;
  local?: boolean;
  bot?: boolean;
}

export interface Create {
  meta: GameMeta;
}

interface Props extends Create, ButtonPopoverProps {
  content?: string;
}

interface CreateMatchFormProps extends FormProps<Store> {
  numPlayersOps: number[];
  bot?: boolean;
}

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

type ItemProps = FormItemProps<Store> & {
  deps?: undefined;
  flag?: (keyof Store)[];
};

function HiddenIf({ flag = ['local', 'bot'], ...props }: ItemProps) {
  return (
    <FormItem deps={flag} noStyle>
      {state => {
        // const hidden = target.some(key => !!state[key] && props.name !== key);
        const hidden = flag.some(key => !!state[key]);
        return hidden ? <div /> : <FormItem {...props} />;
      }}
    </FormItem>
  );
}

function CreateMatchForm({
  bot,
  numPlayersOps,
  initialValues,
  ...props
}: CreateMatchFormProps) {
  return (
    <Form
      {...props}
      initialValues={{
        ...initialValues,
        unlisted: false,
        numPlayers: numPlayersOps[0],
        setupData: { matchName: '', allowSpectate: true }
      }}
    >
      <HiddenIf name="local" valuePropName="checked" flag={['bot']}>
        <Checkbox>Local</Checkbox>
      </HiddenIf>

      {bot && (
        <HiddenIf name="bot" valuePropName="checked" flag={['local']}>
          <Checkbox>Bot</Checkbox>
        </HiddenIf>
      )}

      <HiddenIf
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
      </HiddenIf>

      <HiddenIf
        label="Match Name"
        name={['setupData', 'matchName']}
        validators={[
          validators.required('Please input the match name'),
          validators.maxLength(10, 'Match name cannot longer than 10')
        ]}
      >
        <Input />
      </HiddenIf>

      <FormItem
        label="Number of Players"
        name="numPlayers"
        normalize={Number}
        validators={[validators.required('Please select number of players')]}
      >
        <HTMLSelect fill options={numPlayersOps} />
      </FormItem>

      <HiddenIf
        label="Description ( Optional )"
        name={['setupData', 'description']}
        validators={[
          validators.maxLength(50, 'Description name cannot longer than 50')
        ]}
      >
        <TextArea />
      </HiddenIf>

      <HiddenIf name={['setupData', 'allowSpectate']} valuePropName="checked">
        <Checkbox>Spectate</Checkbox>
      </HiddenIf>

      <HiddenIf name="unlisted" valuePropName="checked">
        <Checkbox>Private</Checkbox>
      </HiddenIf>

      <FormItem name="name" noStyle>
        <div hidden />
      </FormItem>
    </Form>
  );
}

export function CreateMatch({ meta, content, ...props }: Props) {
  const [form] = useForm();
  const [{ playerName }, updatePrefrences] = usePreferences();
  const { name, gameName, numPlayers, bot } = meta;

  async function onConfirm() {
    const store = await form.validateFields();
    const matchID = String(+new Date());

    if (store.local) {
      await gotoMatch({
        matchID,
        local: true,
        name: store.name,
        numPlayers: store.numPlayers
      });
    } else if (store.bot) {
      await gotoMatch({
        matchID,
        bot: true,
        name: store.name,
        numPlayers: store.numPlayers
      });
    } else if (store.setupData) {
      const payload = await createAndJoinMatch(store).toPromise();
      const state: MultiMatchState = {
        ...payload,
        name,
        playerID: '0',
        playerName: store.playerName,
        unlisted: !!store.unlisted
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
      content={content}
      onClick={() =>
        openConfirmDialog({
          title: `Create ${gameName} Match`,
          onConfirm,
          onClosed: () => form.resetFields(),
          children: (
            <CreateMatchForm
              bot={bot}
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
