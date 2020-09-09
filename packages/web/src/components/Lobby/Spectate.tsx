import React from 'react';
import { Button, Dialog, Icon } from '@blueprintjs/core';
import { gotoSpectate, SpectatorState } from '@/services';
import { Player, GameMeta } from '@/typings';
import { useBoolean } from '@/hooks/useBoolean';

interface Props extends Omit<SpectatorState, 'playerID'> {
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
          type === 'single-player' ? openDialog() : gotoSpectate(props)
        }
      />
      <Dialog
        title="Select Player View"
        className="player-view-dialog"
        isOpen={isOpen}
        onClose={closeDialog}
      >
        {players.map(
          ({ name, id }) =>
            typeof name !== 'undefined' && (
              <div
                className="row"
                key={name}
                onClick={() => gotoSpectate({ ...props, playerID: String(id) })}
              >
                {name} <Icon icon="chevron-right" />
              </div>
            )
        )}
      </Dialog>
    </>
  );
}
