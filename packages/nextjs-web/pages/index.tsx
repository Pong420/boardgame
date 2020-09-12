import Head from 'next/head';
import { Layout } from '@/components/Layout';
import { Home } from '@/components/Home';
import { GameList } from '@/components/GameList';

export default function HomePage() {
  return (
    <Layout>
      <Head>
        <title>Boardgame</title>
      </Head>
      <GameList />
      <Home />
    </Layout>
  );
}
