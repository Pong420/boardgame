import React, { useEffect } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonPopover } from '@/components/ButtonPopover';
import { Header, HeaderProps } from '@/components/Header';
import { leaveMatchAndRedirect, matchStorage } from '@/services';
import { Toaster } from '@/utils/toaster';

interface Props extends HeaderProps {}

const onFailure = Toaster.apiError.bind(Toaster, 'Leave Match Failure');

function LeaveMatchButton() {
  const [{ loading }, { fetch }] = useRxAsync(leaveMatchAndRedirect, {
    defer: true,
    onFailure
  });

  useEffect(() => {
    const originUrl = router.asPath;
    function handler(url: string) {
      const state = matchStorage.get();
      if (state && url !== originUrl) {
        router.events.emit('routeChangeError');
        fetch(state);

        // eslint-disable-next-line
        throw `Route change aborted, leaving match`;
      }
    }
    router.events.on('routeChangeStart', handler);
    return () => router.events.off('routeChangeStart', handler);
  }, [fetch]);

  return (
    <ButtonPopover
      minimal
      icon="arrow-left"
      content="Leave match"
      loading={loading}
      onClick={() => fetch(matchStorage.get())}
    />
  );
}

export function MatchHeader(props: Props) {
  return <Header {...props} left={<LeaveMatchButton />} />;
}
