import React, { useRef } from 'react';
import { Button, Dialog, Classes, HTMLSelect } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { defer, empty } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { useRxAsync } from 'use-rx-hooks';
import { Input, Checkbox } from '../../components/Input';
import { useBoolean } from '../../hooks/useBoolean';
import { createForm, validators } from '../../utils/form';
import { PlayerName } from '../../utils/playerName';
import { SetupData, Params$CreateMatch } from '../../typings';
import { createMatch, joinMatch } from '../../services';
import { PATHS } from '../../constants';
import { PlaygroundRouteState } from '../Playground';

interface Store extends Params$CreateMatch {
  playerName: string;
  local?: boolean;
}

interface CreateMatchProps {
  name: string;
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

export function CreateMatch({ name }: CreateMatchProps) {
  const [isOpen, openDialog, closeDialog] = useBoolean(false);
  const [form] = useForm();
  const history = useHistory();
  const { current: onSuccess } = useRef((credentials: string) => {
    history.push(PATHS.PLAYGROUND, {
      name,
      playerID: '0',
      credentials
    } as PlaygroundRouteState);
  });
  const [{ loading }, { fetch }] = useRxAsync(createAndJoinMatch, {
    defer: true,
    onSuccess
  });

  return (
    <div className="create-match">
      <Button icon="plus" onClick={openDialog} minimal />
      <Dialog
        title="New Match"
        isOpen={loading || isOpen}
        onClose={closeDialog}
      >
        <div className={Classes.DIALOG_BODY}>
          <Form
            form={form}
            onFinish={fetch}
            initialValues={{ name, playerName: PlayerName.get() }}
            onValuesChange={(_, { playerName }) => PlayerName.set(playerName)}
            beforeSubmit={store => ({
              ...store,
              name,
              setupData: {
                ...(store.setupData as SetupData),
                numOfPlayers: store.numPlayers
              }
            })}
          >
            <FormItem
              label="Your Name"
              name={['playerName']}
              validators={[
                validators.required('Please input yout name'),
                validators.maxLength(20, 'Your name too long')
              ]}
            >
              <Input />
            </FormItem>

            <FormItem
              label="Match Name"
              name={['setupData', 'matchName']}
              validators={[
                validators.required('Please input the match name'),
                validators.maxLength(20, 'The match name too long')
              ]}
            >
              <Input />
            </FormItem>

            <FormItem
              label="Number of Player"
              name={['numPlayers']}
              validators={[
                validators.required('Please select number of players')
              ]}
            >
              <HTMLSelect fill>
                <option value="" label="" />
                <option value={2} label="2" />
                <option value={3} label="3" />
                <option value={4} label="4" />
              </HTMLSelect>
            </FormItem>

            <FormItem name={['unlisted']} valuePropName="checked">
              <Checkbox>Private</Checkbox>
            </FormItem>

            <FormItem name={['local']} valuePropName="checked">
              <Checkbox>Local</Checkbox>
            </FormItem>
          </Form>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={closeDialog} disabled={loading}>
              Cancel
            </Button>
            <Button intent="primary" loading={loading} onClick={form.submit}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
