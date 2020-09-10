import React from 'react';
import { CreateMatch, Create } from './CreateMatch';

export function NoMatches(props: Create) {
  return (
    <div className="no-matches">
      <div>
        <div className="message">No Matches Found</div>
        <CreateMatch {...props} intent="primary" text="Create Match" />
      </div>
    </div>
  );
}
