import React from 'react';
import 'typeface-muli';
import '@/styles/globals.scss';
import { PreferencesProvider } from '@/services';
import { Layout } from '@/components/Layout';
import type { AppProps /*, AppContext */ } from 'next/app';

interface ExtendAppProps extends AppProps {
  Component: AppProps['Component'] & { gameList?: boolean };
}

function MyApp({ Component, pageProps }: ExtendAppProps) {
  return (
    <PreferencesProvider>
      <Layout gameList={Component.gameList}>
        <Component {...pageProps} />
      </Layout>
    </PreferencesProvider>
  );
}

export default MyApp;
