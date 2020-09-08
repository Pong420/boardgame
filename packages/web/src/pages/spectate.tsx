import React from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@/typings';
import { Match } from '@/components/Match';
import { useGameMeta } from '@/store/gameMeta';

interface MatchParams {
  matchID?: string;
  matchName?: string;
}

interface Context {
  name: string;
}

export default function ({
  matchID,
  matchName,
  pageContext: { name }
}: RouteComponentProps<unknown, Context> & MatchParams) {
  const meta = useGameMeta(name);

  if (!meta || !matchID || !matchName) {
    typeof window !== 'undefined' && navigate('/');
    return null;
  }

  return (
    <Match
      name={name}
      matchID={matchID}
      matchName={matchName}
      gameMeta={meta}
    />
  );
}
