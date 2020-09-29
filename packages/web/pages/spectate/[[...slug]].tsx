import React, { useEffect } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { GetServerSideProps } from 'next';
import { gameMetaMap } from '@/games';
import { Match } from '@/components/Match';
import { Toaster } from '@/utils/toaster';
import { getSpectateQuery } from '@/services';

interface Params {
  name: string;
  matchID: string;
  playerID?: string;
}

interface Props extends Required<Params> {
  validParams: boolean;
}

const isNumberString = (payload?: string) => payload && !isNaN(Number(payload));

export default function SpectatePage({
  name,
  matchID,
  playerID,
  validParams
}: Props) {
  const meta = gameMetaMap[name];
  const validation = () => {
    if (!validParams) return 'Invalid Params';
    if (!matchID) return 'Missing MatchID';
    if (!meta) return 'Invalid Game';
    if (!(meta.spectate === 'single-player' ? isNumberString(playerID) : true))
      return 'Incorrect or Mssing PlayerID';
  };

  const error = validation();

  useEffect(() => {
    if (error) {
      Toaster.failure({ message: error });
      router.push(meta ? `/lobby/${meta.name}` : '/');
    }
  }, [error, meta]);

  return (
    <>
      <Head>
        <title>Boardgame | Spectate</title>
      </Head>

      {!error && (
        <Match name={name} matchID={matchID} playerID={playerID} spectate />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query
}) => {
  const slug = Array.isArray(query.slug) ? query.slug : [];

  return {
    props: {
      ...getSpectateQuery(query),
      validParams: slug.length === 2 || slug.length === 3
    }
  };
};
