import React from 'react';
import { Dialog } from '@blueprintjs/core';
import { ButtonPopover } from '@/components/ButtonPopover';
import { PreferencesForm, PreferencesFormProps } from './PreferencesForm';
import { useBoolean } from '@/hooks/useBoolean';

interface Props extends PreferencesFormProps {}

export function Preferences({ disablePlayerName }: Props) {
  const [isOpen, openDialog, closeDialog] = useBoolean();
  return (
    <>
      <ButtonPopover
        minimal
        content="Preferences"
        icon="settings"
        onClick={openDialog}
      />
      <Dialog
        isOpen={isOpen}
        onClose={closeDialog}
        title="Preferences"
        className="preferences-dialog"
      >
        <PreferencesForm disablePlayerName={disablePlayerName} />
      </Dialog>
    </>
  );
}
