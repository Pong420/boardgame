import React from 'react';
import Head from 'next/head';
import { Home } from '@/components/Home';
import { GameList } from '@/components/GameList';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Boardgame</title>
      </Head>
      <GameList />
      <Home />
    </>
  );
}
