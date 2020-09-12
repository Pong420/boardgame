import React, { ReactNode } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonPopover } from '@/components/ButtonPopover';
import { Preferences } from '@/components/Preferences';
import { leaveMatchAndRedirect, matchStorage } from '@/services';
import { Toaster } from '@/utils/toaster';
import { ShareButton } from '../ShareButton';
import { Button } from '@blueprintjs/core';

interface Props {
  name: string;
  matchID: string;
  playerName: string;
  gameName: string;
  title?: ReactNode;
}

const onFailure = Toaster.apiError.bind(Toaster, 'Leave Match Failure');

function LeaveMatchButton() {
  const [{ loading }, { fetch }] = useRxAsync(leaveMatchAndRedirect, {
    defer: true,
    onFailure
  });

  return (
    <ButtonPopover
      minimal
      icon="arrow-left"
      content="Leave match"
      loading={loading}
      onClick={() => fetch(matchStorage.get())}
    />
  );
}

export function MatchHeader({
  title,
  name,
  playerName,
  gameName,
  matchID
}: Props) {
  return (
    <div className="match-header">
      <div>
        <LeaveMatchButton />
        <Button minimal icon="blank" style={{ visibility: 'hidden' }} />
      </div>
      <div className="header-title">{title}</div>
      <div>
        <ShareButton
          name={name}
          matchID={matchID}
          playerName={playerName}
          gameName={gameName}
        />
        <Preferences disablePlayerName />
      </div>
    </div>
  );
}
