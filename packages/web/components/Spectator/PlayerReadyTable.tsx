import React from 'react';
import { Colors, HTMLTable, Icon } from '@blueprintjs/core';
import { Player } from '@/hooks/useMatch';
import styles from './Spectator.module.scss';

interface Props {
  players: Player[];
}

export function PlayerReadyTable({ players }: Props) {
  return (
    <div className={styles['player-ready']}>
      <div className={styles['player-ready-title']}>
        Waiting for players ready
      </div>
      <HTMLTable bordered>
        <thead>
          <tr>
            <th>Player</th>
            <th>Ready</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, idx) => {
            const player: Partial<Player> = p || {};
            return (
              <tr key={idx}>
                <td>{player.playerName || ' - '}</td>
                <td>
                  {player.ready ? (
                    <Icon icon="tick-circle" color={Colors.GREEN3} />
                  ) : (
                    <Icon icon="circle" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </HTMLTable>
    </div>
  );
}
