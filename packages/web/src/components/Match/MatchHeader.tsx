import React, { ReactNode } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonPopover } from '@/components/ButtonPopover';
import { Preferences } from '@/components/Preferences';
import { leaveMatchAndRedirect, matchStorage } from '@/services';
import { Toaster } from '@/utils/toaster';

interface Props {
  name: string;
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

export function MatchHeader({ title }: Props) {
  return (
    <div className="match-header">
      <LeaveMatchButton />
      <div className="header-title">{title}</div>
      <div>
        <Preferences disablePlayerName />
      </div>
    </div>
  );
}
