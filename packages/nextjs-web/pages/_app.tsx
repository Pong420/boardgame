import React from 'react';
import 'typeface-muli';
import '@/styles/globals.scss';
import { PreferencesProvider } from '@/services';
import { Layout } from '@/components/Layout';

import type { AppProps /*, AppContext */ } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PreferencesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PreferencesProvider>
  );
}

export default MyApp;
