import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { gameMetaMap } from '@/games';
import { Redirect } from '@/components/Redirect';
import { Invitation } from '@/components/Invitation';

interface Params {
  name: string;
  matchID: string;
}

interface Props extends Partial<Params> {}

export default function SpectatePage({ name, matchID }: Props) {
  const meta = gameMetaMap[name];

  if (matchID && meta) {
    return (
      <>
        <Head>
          <title>Boardgame | Invitation</title>
        </Head>
        <Invitation name={name} matchID={matchID} />
      </>
    );
  }

  return <Redirect />;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query
}) => {
  const [name = '', matchID = ''] = Array.isArray(query.slug) ? query.slug : [];

  return {
    props: {
      name,
      matchID
    }
  };
};
