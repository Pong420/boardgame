import React, { useEffect } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { useRxAsync } from 'use-rx-hooks';
import { MatchesHeader } from './MatchesHeader';
import { MatchItem } from './MatchItem';
import { Match } from '../../typings';
import { getMatches } from '../../services';
import { createUseCRUDReducer } from '../../hooks/crud';

interface MatchParams {
  name?: string;
}

const useMatchesReducer = createUseCRUDReducer<Match, 'matchID'>('matchID', {
  prefill: false
});

const request = (...args: Parameters<typeof getMatches>) =>
  getMatches(...args).then(res => res.data.matches);

export function Matches({ match }: RouteChildrenProps<MatchParams>) {
  const [state, actions] = useMatchesReducer();
  const [, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess: actions.list
  });
  const name = match?.params.name;

  useEffect(() => {
    name && fetch({ name });
  }, [fetch, name]);

  return (
    <div className="matches">
      <MatchesHeader />
      <div className="matches-content">
        {state.list.map(match => (
          <MatchItem key={match.matchID} {...match} />
        ))}
      </div>
    </div>
  );
}
