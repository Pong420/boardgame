import React from 'react';
import { Link, generatePath } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { PATHS } from '../../constants';

export function MatchesHeader() {
  return (
    <div className="matches-header">
      <Link to={generatePath(PATHS.HOME, {})}>
        <Button icon="arrow-left" minimal />
      </Link>
      <div className="header-title" />
      <div />
    </div>
  );
}
