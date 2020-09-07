import React, { ReactNode } from 'react';
import { ButtonPopover } from '@/components/ButtonPopover';
import { confirmLeaveMatch } from '@/services';

interface Props {
  title?: ReactNode;
}

export function MatchHeader({ title }: Props) {
  return (
    <div className="match-header">
      <div>
        <ButtonPopover
          minimal
          icon="arrow-left"
          content="Leave match"
          onClick={confirmLeaveMatch}
        />
      </div>
      <div className="header-title">{title}</div>
      <div></div>
    </div>
  );
}
