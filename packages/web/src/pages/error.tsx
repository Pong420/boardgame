import React from 'react';
import { navigate } from 'gatsby';
import ButtonPopover from '@/components/ButtonPopover';

interface MatchParams {
  message?: string;
}

export default function ({ message }: MatchParams) {
  if (!message) {
    navigate('/');
  }

  return (
    <div className="error-page">
      <div className="error-page-header">
        <ButtonPopover
          minimal
          icon="arrow-left"
          content="Go Back"
          onClick={() => navigate(-1)}
        />
        <div className="header-title"></div>
        <div />
      </div>
      <div className="error-page-content">{message}</div>
    </div>
  );
}
