import React from 'react';
import { defer, empty } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HTMLSelect } from '@blueprintjs/core';
import { createForm, FormProps, validators } from '@/utils/form';
import { Params$CreateMatch } from '@/typings';
import { gotoMatch, createMatch, joinMatch, PlayerName } from '@/services';
import { Input, TextArea, Checkbox } from '../Input';
import { ButtonPopover } from '../ButtonPopover';
import { openConfirmDialog } from '../ConfirmDialog';
import { PlayerNameControl } from '../PlayerNameControl';

interface Store extends Params$CreateMatch {
  playerName: string;
  local?: boolean;
}

interface Props {
  name: string;
  gameGame: string;
  numOfPlayers: number[];
}

const { Form, FormItem, useForm } = createForm<Store>();

const createAndJoinMatch = ({ playerName, local, name, ...reset }: Store) =>
  defer(() => createMatch({ name, ...reset })).pipe(
    switchMap(res => {
      const { matchID } = res.data;
      return defer(() =>
        joinMatch({ name, matchID, playerName, playerID: '0' })
      ).pipe(
        map(res => ({
          matchID,
          credentials: res.data.playerCredentials
        })),
        catchError(() => empty())
      );
    })
  );

function CreateMatchForm({
  numPlayersOps,
  ...props
}: FormProps<Store> & { numPlayersOps: number[] }) {
  return (
    <Form {...props}>
      <FormItem
        label="Your Name"
        name="playerName"
        validators={[validators.required('Please input your name')]}
      >
        <PlayerNameControl
          fill
          alignText="left"
          rightIcon="edit"
          placehodler="Click and type your name"
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
        <HTMLSelect fill>
          <option value="" label="---" />
          {numPlayersOps.map((num, index) => (
            <option key={index} value={num} label={String(num)} />
          ))}
        </HTMLSelect>
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

      <FormItem name={['unlisted']} valuePropName="checked">
        <Checkbox>Private</Checkbox>
      </FormItem>

      <FormItem name={['local']} valuePropName="checked">
        <Checkbox>Local</Checkbox>
      </FormItem>
    </Form>
  );
}

export function CreateMatch({ name, gameGame, numOfPlayers }: Props) {
  const [form] = useForm();
  return (
    <ButtonPopover
      minimal
      icon="plus"
      content={`Create Match`}
      onClick={() =>
        openConfirmDialog({
          title: `Create ${gameGame} Match`,
          onConfirm: async () => {
            const store = await form.validateFields();
            const payload = await createAndJoinMatch({
              ...store,
              name,
              setupData: {
                ...store.setupData!,
                numOfPlayers: store.numPlayers
              }
            }).toPromise();
            await gotoMatch({ ...payload, playerID: '0', name });
          },
          children: (
            <CreateMatchForm
              form={form}
              initialValues={{ name, playerName: PlayerName.get() }}
              onValuesChange={(_, { playerName }) =>
                PlayerName.save(playerName)
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
