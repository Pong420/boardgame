import React from 'react';
import 'typeface-muli';
import { PreferencesProvider } from '@/services';
import '@/styles/globals.scss';

import type { AppProps /*, AppContext */ } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PreferencesProvider>
      <Component {...pageProps} />
    </PreferencesProvider>
  );
}

export default MyApp;
