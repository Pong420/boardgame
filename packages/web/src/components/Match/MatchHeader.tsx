import React, { ReactNode } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonPopover } from '@/components/ButtonPopover';
import { leaveMatchAndRedirect, matchStorage } from '@/services';
import { navigate } from 'gatsby';

interface Props {
  name: string;
  local?: boolean;
  title?: ReactNode;
}

function LeaveMatchButton({ name, local }: Pick<Props, 'local' | 'name'>) {
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
        if (local) {
          navigate(`/lobby/${name}`);
        } else {
          const state = matchStorage.get();
          state && fetch(state);
        }
      }}
    />
  );
}

export function MatchHeader({ name, local, title }: Props) {
  return (
    <div className="match-header">
      <LeaveMatchButton name={name} local={local} />
      <div className="header-title">{title}</div>
      <div></div>
    </div>
  );
}
