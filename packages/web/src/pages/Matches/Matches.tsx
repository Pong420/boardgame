import React, { useCallback } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { useRxAsync } from 'use-rx-hooks';
import { MatchesProvider, useMatches } from './MatchesProvider';
import { MatchesHeader } from './MatchesHeader';
import { MatchItem } from './MatchItem';
import { getMatches } from '../../services';

interface MatchParams {
  name?: string;
}

interface ContentProps {
  name: string;
}

function MatchesContent({ name }: ContentProps) {
  const [state, actions] = useMatches();
  const request = useCallback(
    () => getMatches({ name }).then(res => res.data.matches),
    [name]
  );

  const [, { fetch }] = useRxAsync(request, {
    onSuccess: actions.list
  });

  return (
    <div className="matches">
      <MatchesHeader name={name} onRefresh={fetch} />
      <div className="matches-content">
        {state.list.map(match => (
          <MatchItem key={match.matchID} name={name} {...match} />
        ))}
      </div>
    </div>
  );
}

export function Matches({ match }: RouteChildrenProps<MatchParams>) {
  const name = match?.params.name;

  if (name) {
    return (
      <MatchesProvider>
        <MatchesContent name={name} />
      </MatchesProvider>
    );
  }

  return null;
}
