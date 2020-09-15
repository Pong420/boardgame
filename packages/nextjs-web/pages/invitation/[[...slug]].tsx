import React, { useEffect } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { GetServerSideProps } from 'next';
import { gameMetaMap } from '@/games';
import { Invitation } from '@/components/Invitation';
import { Toaster } from '@/utils/toaster';

interface Params {
  name: string;
  matchID: string;
}

interface Props extends Required<Params> {
  validParams: boolean;
}

export default function InvitationPage({ name, matchID, validParams }: Props) {
  const meta = gameMetaMap[name];
  const validation = () => {
    if (!validParams) return 'Invalid Params';
    if (!matchID) return 'Missing MatchID';
    if (!meta) return 'Invalid Game';
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
        <title>Boardgame | Invitation</title>
      </Head>
      <Invitation name={name} matchID={matchID} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query
}) => {
  const slug = Array.isArray(query.slug) ? query.slug : [];
  const [name = '', matchID = ''] = slug;

  return {
    props: {
      name,
      matchID,
      validParams: slug.length === 2
    }
  };
};
