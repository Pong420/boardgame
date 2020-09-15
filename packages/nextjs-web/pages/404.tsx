import React from 'react';
import router from 'next/router';

export default function Custom404() {
  if (typeof window !== 'undefined') {
    router.push('/');
  }
  return <div />;
}
