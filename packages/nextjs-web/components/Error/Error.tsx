import React from 'react';
import router from 'next/router';
import { ButtonPopover } from '@/components/ButtonPopover';
import { Github } from '@/components/Github';
import { Redirect } from '@/components/Redirect';
import styles from './Error.module.scss';

interface Props {
  message?: string;
}

export function Error({ message }: Props) {
  return message ? (
    <div className={styles['error-page']}>
      <div className={styles['error-page-header']}>
        <ButtonPopover
          minimal
          icon="arrow-left"
          content="Back to home"
          onClick={() => router.push('/')}
        />
        <div className={styles['error-page-header-title']}></div>
        <div />
      </div>
      <div className={styles['error-page-content']}>
        <div>
          <div className="message">{message}</div>
          <Github className={styles['github']} />
        </div>
      </div>
    </div>
  ) : (
    <Redirect />
  );
}
