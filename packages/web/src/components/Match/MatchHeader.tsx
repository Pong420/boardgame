import React, { ReactNode } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonPopover } from '@/components/ButtonPopover';
import { leaveMatchAndRedirect, matchStorage } from '@/services';

interface Props {
  title?: ReactNode;
}

function LeaveMatchButton() {
  const [{ loading }, { fetch }] = useRxAsync(leaveMatchAndRedirect, {
    defer: true
  });

  return (
    <ButtonPopover
      minimal
      icon="arrow-left"
      content="Leave match"
      loading={loading}
      onClick={() => {
        const state = matchStorage.get();
        state && fetch(state);
      }}
    />
  );
}

export function MatchHeader({ title }: Props) {
  return (
    <div className="match-header">
      <LeaveMatchButton />
      <div className="header-title">{title}</div>
      <div></div>
    </div>
  );
}
