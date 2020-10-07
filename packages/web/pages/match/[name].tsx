import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { GetServerSideProps } from 'next';
import { Match } from '@/components/Match';
import { gameMetaMap } from '@/games';
import { MatchState, matchStorage } from '@/services';
import { historyState } from '@/utils/historyState';

type Params = {
  name: string;
};

interface Props {
  name?: string;
  matchID?: string;
}

export default function MatchPage({ name, matchID }: Props) {
  const meta = name && gameMetaMap[name];
  const [state, setState] = useState<MatchState>();

  useEffect(() => {
    // historyState for local match
    const newState = historyState.get() || matchStorage.get();
    newState ? setState(newState) : router.push('/');
  }, [matchID]);

  if (meta) {
    return (
      <>
        <Head>
          <title>Boardgame | Match | {meta.gameName}</title>
        </Head>
        {state ? <Match {...state} /> : null}
      </>
    );
  }

  return null;
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
