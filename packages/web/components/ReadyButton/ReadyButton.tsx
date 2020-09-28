import React from 'react';
import { Button, Icon, Popover } from '@blueprintjs/core';
import { useBoolean } from '@/hooks/useBoolean';
import { useChat } from '@/hooks/useChat';
import styles from './ReadyButton.module.scss';

interface Props {
  playerID: string;
  toggleReady: () => void;
}

export function ReadyButton({ playerID, toggleReady }: Props) {
  const [{ ready, players }] = useChat();
  const [isOpen, open, close] = useBoolean(true);
  const isReady = ready.includes(playerID);
  const ohterPlayersReady =
    players.findIndex(
      p => !p || (p.playerID !== playerID && !ready.includes(p.playerID))
    ) === -1;
  const waitingForMe = ohterPlayersReady && !isReady;

  return (
    <Popover
      isOpen={players.length > 0 && (waitingForMe || isOpen)}
      onClose={close}
      interactionKind="click-target"
      popoverClassName={styles['ready-popover']}
      canEscapeKeyClose={false}
      content={
        <>
          {waitingForMe ? (
            <div className={styles['waiting-for-me']}>
              Other players are ready. How about you ?
            </div>
          ) : (
            <>
              <div className={styles['ready-header']}>
                Players <Button minimal icon="cross" onClick={close} />
              </div>
              <div className={styles['ready-content']}>
                {players.map((player, idx) => {
                  const isReady = ready.includes(player?.playerID || '');
                  return (
                    <div className={styles['ready-player']} key={idx}>
                      {isReady ? (
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
                          : player?.playerName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
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
