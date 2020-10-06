import React from 'react';
import { Dialog, Icon } from '@blueprintjs/core';
import { gotoSpectate, SpectateState } from '@/services';
import { Player, GameMeta } from '@/typings';
import { useBoolean } from '@/hooks/useBoolean';
import { ButtonPopover, ButtonPopoverProps } from './ButtonPopover';

interface Props
  extends Omit<SpectateState, 'playerID' | 'isSpectator'>,
    Omit<ButtonPopoverProps, 'type'> {
  allow?: boolean;
  players: Player[];
  type?: GameMeta['spectate'];
}

export function Spectate({
  allow,
  type,
  players,
  name,
  matchID,
  ...props
}: Props) {
  const [isOpen, openDialog, closeDialog] = useBoolean();

  return (
    <>
      <ButtonPopover
        {...props}
        disabled={!allow}
        onClick={() =>
          type === 'single-player'
            ? openDialog()
            : gotoSpectate({ name, matchID, isSpectator: true })
        }
      />
      <Dialog title="Select a player" isOpen={isOpen} onClose={closeDialog}>
        {players.map(
          ({ name: playerName, id }, idx) =>
            typeof playerName !== 'undefined' && (
              <div
                className="player-view-dialog-row"
                key={`${playerName}-${idx}`}
                onClick={() =>
                  gotoSpectate({
                    name,
                    matchID,
                    isSpectator: true,
                    playerID: String(id)
                  })
                }
              >
                {playerName} <Icon icon="chevron-right" />
              </div>
            )
        )}
      </Dialog>
      <style jsx>
        {`
          .player-view-dialog-row {
            @include flex(center, space-between);
            @include relative();
            cursor: pointer;
            max-width: 300px;
            padding: 15px 15px 15px 20px;
            word-break: break-all;

            &:hover {
              background: var(--hover-color);
            }

            + .player-view-dialog-row {
              &:before {
                @include absolute(0, null, 0);
                @include dimen(100%, 1px);
                content: '';
                display: block;
                border-top: 1px solid var(--accent-color);
              }
            }
          }
        `}
      </style>
    </>
  );
}
