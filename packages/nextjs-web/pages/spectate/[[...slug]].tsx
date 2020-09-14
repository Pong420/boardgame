import React from 'react';
import { GetServerSideProps } from 'next';
import { gameMetaMap } from '@/games';
import { Redirect } from '@/components/Redirect';
import { Match } from '@/components/Match';

interface Params {
  name: string;
  matchID: string;
  playerID?: string;
}

interface Props extends Partial<Params> {}

const isNumberString = (payload?: string) => payload && !isNaN(Number(payload));

export default function SpectatePage({ name, matchID, playerID }: Props) {
  const meta = gameMetaMap[name];

  if (
    matchID &&
    meta &&
    (meta.spectate === 'single-player' ? isNumberString(playerID) : true)
  ) {
    return <Match name={name} matchID={matchID} playerID={playerID} />;
  }

  return <Redirect />;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query
}) => {
  const [name = '', matchID = '', playerID = ''] = Array.isArray(query.slug)
    ? query.slug
    : [];

  return {
    props: {
      name,
      matchID,
      playerID
    }
  };
};
