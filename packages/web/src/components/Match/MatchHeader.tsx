import React, { ReactNode } from 'react';
import { navigate } from 'gatsby';
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

function LeaveMatchButton({ name }: Pick<Props, 'name'>) {
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
        }
        navigate(`/lobby/${name}/`);
      }}
    />
  );
}

export function MatchHeader({ name, title }: Props) {
  return (
    <div className="match-header">
      <LeaveMatchButton name={name} />
      <div className="header-title">{title}</div>
      <div>
        <Preferences disablePlayerName />
      </div>
    </div>
  );
}
