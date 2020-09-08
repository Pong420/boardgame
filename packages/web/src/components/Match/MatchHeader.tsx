import React, { ReactNode } from 'react';
import { navigate } from 'gatsby';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonPopover } from '@/components/ButtonPopover';
import { Preferences } from '@/components/Preferences';
import { leaveMatchAndRedirect, matchStorage } from '@/services';
import { Toaster } from '@/utils/toaster';

interface Props {
  name: string;
  local?: boolean;
  title?: ReactNode;
}

const onFailure = Toaster.apiError.bind(Toaster, 'Leave Match Failure');

function LeaveMatchButton({ name, local }: Pick<Props, 'local' | 'name'>) {
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
      onClick={() => {
        const state = matchStorage.get();
        if (state) {
          return fetch(state);
        } else {
          // onFailure('State is not defined');
        }
        navigate(`/lobby/${name}/`);
      }}
    />
  );
}

export function MatchHeader({ name, local, title }: Props) {
  return (
    <div className="match-header">
      <LeaveMatchButton name={name} local={local} />
      <div className="header-title">{title}</div>
      <div>
        <Preferences />
      </div>
    </div>
  );
}
