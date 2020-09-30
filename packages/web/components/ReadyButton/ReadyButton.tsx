import React from 'react';
import { Button, Icon, Popover } from '@blueprintjs/core';
import { useBoolean } from '@/hooks/useBoolean';
import { useMatch } from '@/hooks/useMatch';
import styles from './ReadyButton.module.scss';

interface Props {
  playerID: string;
  toggleReady: () => void;
}

export function ReadyButton({ playerID, toggleReady }: Props) {
  const [{ players }] = useMatch();
  const isReady = !!players[Number(playerID)]?.ready;
  const [isOpen, open, close] = useBoolean(!isReady);
  const playersNotReady = players.filter(p => !p || !p.ready);
  const waitingForMe = playersNotReady.length === 1 && !isReady;

  const content = waitingForMe ? (
    <div className={styles['waiting-for-me']}>
      Other players are ready. How about you?
    </div>
  ) : (
    <>
      <div className={styles['ready-header']}>
        Players <Button minimal icon="cross" onClick={close} />
      </div>
      <div className={styles['ready-content']}>
        {players.map((player, idx) => {
          return (
            <div className={styles['ready-player']} key={idx}>
              {player?.ready ? (
                <Icon
                  className={styles['ready-player-active']}
                  icon="tick-circle"
                />
              ) : (
                <Icon icon="circle" />
              )}
              <div className={styles['ready-player-name']}>
                {playerID === player?.playerID
                  ? 'You'
                  : player?.playerName === 'You'
                  ? `P${player.playerID}`
                  : player?.playerName}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <Popover
      isOpen={players.length > 0 && (waitingForMe || isOpen)}
      onClose={close}
      interactionKind="click-target"
      popoverClassName={styles['ready-popover']}
      canEscapeKeyClose={false}
      content={
        <>
          {content}
          <Button
            fill
            intent="primary"
            onClick={() => {
              toggleReady();
              close();
            }}
          >
            {isReady ? 'I am not ready' : 'I am ready'}
          </Button>
        </>
      }
    >
      <Button
        minimal
        icon="confirm"
        onClick={open}
        intent={isReady ? 'success' : 'none'}
      />
    </Popover>
  );
}
