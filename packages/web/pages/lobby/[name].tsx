import React from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import { GameList } from '@/components/GameList';
import { Lobby } from '@/components/Lobby';
import { gameMetaMap, gameMetadata } from '@/games';

type Params = {
  name: string;
};

interface Props {
  name?: string;
}

export default function LobbyPage({ name }: Props) {
  const meta = name && gameMetaMap[name];
  if (meta) {
    return (
      <>
        <Head>
          <title>Boardgame | Lobby | {meta.gameName}</title>
        </Head>
        <GameList />
        <Lobby {...meta} />
      </>
    );
  }
  return null;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: gameMetadata.map(({ name }) => ({ params: { name } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params
}) => ({
  props: {
    ...params
  }
});