import React from 'react';
import { RouteComponentProps } from '@/typings';
import { Match } from '@/components/Match';

interface MatchParams {
  matchID: string;
}

interface Context {
  name: string;
}

export default function ({
  matchID,
  pageContext
}: RouteComponentProps<unknown, Context> & MatchParams) {
  return <Match name={pageContext.name} matchID={matchID} />;
}
