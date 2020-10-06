import React, { ReactNode } from 'react';
import router from 'next/router';
import { Button } from '@blueprintjs/core';
import styles from './Spectator.module.scss';

interface Props {
  name: string;
  title?: ReactNode;
  children?: ReactNode;
}

const Blank = () => (
  <Button minimal icon="blank" style={{ visibility: 'hidden' }} />
);

export function SpectatorHeader({ name, title, children }: Props) {
  const buttons = Array.isArray(children)
    ? children.filter(el => React.isValidElement(el))
    : [];

  return (
    <div className={styles['spectator-header']}>
      <div>
        <Button
          minimal
          icon="arrow-left"
          onClick={() => router.push(`/lobby/${name}`)}
        />
        {buttons.slice(1).map((_, idx) => (
          <Blank key={idx} />
        ))}
      </div>
      <div className={styles['spectator-header-title']}>{title}</div>
      <div>{children}</div>
    </div>
  );
}
