import React from 'react';
import router from 'next/router';

interface Props {
  to?: string;
  replace?: boolean;
}

export function Redirect({ to = '/', replace }: Props) {
  if (typeof window !== 'undefined') {
    router[replace ? 'replace' : 'push'](to);
  }
  return <div />;
}
