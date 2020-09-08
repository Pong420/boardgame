import React from 'react';
import { navigate } from 'gatsby';
import { ButtonPopover } from '@/components/ButtonPopover';
import { Github } from '@/components/Github';

interface MatchParams {
  message?: string;
}

export default function ({ message }: MatchParams) {
  if (typeof window !== 'undefined' && !message) {
    navigate('/');
  }

  return (
    <div className="error-page">
      <div className="error-page-header">
        <ButtonPopover
          minimal
          icon="arrow-left"
          content="Back to home"
          onClick={() => navigate('/')}
        />
        <div className="header-title"></div>
        <div />
      </div>
      <div className="error-page-content">
        <div>
          <div className="message">{message}</div>
          <Github />
        </div>
      </div>
    </div>
  );
}
