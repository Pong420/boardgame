import React from 'react';
import { Button, IButtonProps } from '@blueprintjs/core';
import { createForm, Control, validators } from '@/utils/form';
import { createOpenDialog } from '@/utils/openDialog';
import { Input } from './Input';
import { ConfirmDialog, ConfirmDialogProps } from './ConfirmDialog';

interface Store {
  playerName: string;
}

interface DialogProps extends Omit<ConfirmDialogProps, 'onConfirm'> {
  initialValues?: Store;
  onConfirm: (payload: string) => void;
}

interface ControlProps extends IButtonProps, Control<string> {
  placehodler?: string;
}

const { Form, FormItem, useForm } = createForm<Store>();

const open = createOpenDialog(PlayerNameDialog);

export const getPlayerName = (props?: Partial<DialogProps>) => {
  return new Promise<string>((resolve, reject) => {
    return open({ ...props, onConfirm: resolve, onClose: reject });
  });
};

export function PlayerNameDialog({
  initialValues,
  onConfirm,
  ...props
}: DialogProps) {
  const [form] = useForm();
  return (
    <ConfirmDialog
      {...props}
      onConfirm={() =>
        form.validateFields().then(({ playerName }) => onConfirm(playerName))
      }
      onClosed={() => form.resetFields()}
    >
      <Form form={form} initialValues={initialValues}>
        <FormItem
          label="Your Name"
          name="playerName"
          validators={[
            validators.required('Please input your name'),
            validators.maxLength(10, 'Name cannot longer than 10')
          ]}
        >
          <Input autoFocus />
        </FormItem>
      </Form>
    </ConfirmDialog>
  );
}

export function PlayerNameControl({
  value,
  onChange,
  placehodler = 'Add',
  ...props
}: ControlProps) {
  return (
    <Button
      {...props}
      text={value || placehodler}
      onClick={() =>
        getPlayerName({
          title: value ? 'Rename' : 'Configure Player Name',
          initialValues: { playerName: value || '' }
        }).then(onChange)
      }
    />
  );
}
