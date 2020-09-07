import React from 'react';
import { defer, empty } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { navigate } from 'gatsby';
import { HTMLSelect } from '@blueprintjs/core';
import { createForm, FormProps, validators } from '@/utils/form';
import { PlayerName, PlayerNameValidators } from '@/utils/playerName';
import { Params$CreateMatch } from '@/typings';
import { createMatch, joinMatch } from '@/services';
import { Input, TextArea, Checkbox } from '../Input';
import { ButtonPopover } from '../ButtonPopover';
import { openConfirmDialog } from '../ConfirmDialog';

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
    switchMap(res =>
      defer(() =>
        joinMatch({
          name,
          playerName,
          playerID: '0',
          matchID: res.data.matchID
        })
      ).pipe(catchError(() => empty()))
    ),
    map(res => res.data.playerCredentials)
  );

function CreateMatchForm({
  numPlayersOps,
  ...props
}: FormProps<Store> & { numPlayersOps: number[] }) {
  return (
    <Form {...props}>
      <FormItem
        label="Your Name"
        name={['playerName']}
        validators={PlayerNameValidators}
      >
        <Input />
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
            const credentials = await createAndJoinMatch({
              ...store,
              name,
              setupData: {
                ...store.setupData!,
                numOfPlayers: store.numPlayers
              }
            }).toPromise();
            await navigate(`/match/${name}`, {
              state: { credentials, playerID: '0' }
            });
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
