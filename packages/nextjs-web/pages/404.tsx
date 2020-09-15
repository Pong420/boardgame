import React from 'react';
import router from 'next/router';
import { Toaster } from '@/utils/toaster';

export default function Custom404() {
  if (typeof window !== 'undefined') {
    Toaster.failure({ message: 'Page Not Found' });
    router.push('/');
  }
  return <div />;
}
