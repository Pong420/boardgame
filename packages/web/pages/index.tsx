import React from 'react';
import Head from 'next/head';
import { Home } from '@/components/Home';

function HomePage() {
  return (
    <>
      <Head>
        <title>Boardgame | Home</title>
      </Head>
      <Home />
    </>
  );
}

HomePage.gameList = true;

export default HomePage;
