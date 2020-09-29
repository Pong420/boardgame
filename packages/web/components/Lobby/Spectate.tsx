import React from 'react';
import { Button, Dialog, Icon } from '@blueprintjs/core';
import { gotoSpectate, SpectateState } from '@/services';
import { Player, GameMeta } from '@/typings';
import { useBoolean } from '@/hooks/useBoolean';
import styles from './Lobby.module.scss';

interface Props extends Omit<SpectateState, 'playerID' | 'isSpectator'> {
  allow?: boolean;
  players: Player[];
  type?: GameMeta['spectate'];
}

const text = 'Spectate';

export function Spectate({ allow, type, players, ...props }: Props) {
  const [isOpen, openDialog, closeDialog] = useBoolean();
  return (
    <>
      <Button
        text={text}
        disabled={!allow}
        onClick={() =>
          type === 'single-player'
            ? openDialog()
            : gotoSpectate({ ...props, isSpectator: true })
        }
      />
      <Dialog title="Select Player View" isOpen={isOpen} onClose={closeDialog}>
        {players.map(
          ({ name, id }) =>
            typeof name !== 'undefined' && (
              <div
                className={styles['player-view-dialog-row']}
                key={name}
                onClick={() =>
                  gotoSpectate({
                    ...props,
                    isSpectator: true,
                    playerID: String(id)
                  })
                }
              >
                {name} <Icon icon="chevron-right" />
              </div>
            )
        )}
      </Dialog>
    </>
  );
}
