import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { GetServerSideProps } from 'next';
import { Match } from '@/components/Match';
import { gameMetaMap } from '@/games';
import { historyState, MatchState } from '@/services';

type Params = {
  name: string;
};

interface Props {
  name: string;
  matchID?: string;
}

export default function MatchPage({ name, matchID }: Props) {
  const meta = gameMetaMap[name];
  const [state, setState] = useState<MatchState>();

  useEffect(() => {
    const state = historyState.get();
    state ? setState(state) : router.push('/');
  }, [matchID]);

  return (
    <>
      <Head>
        <title>Lobby | {meta.gameName}</title>
      </Head>
      {state && meta ? <Match {...state} /> : null}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  params,
  query
}) => {
  return {
    props: {
      ...params,
      matchID: typeof query.matchID === 'string' ? query.matchID : ''
    }
  };
};
