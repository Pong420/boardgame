import router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { createBoardgameStorage, onBoardgameStorage$ } from '@/utils/storage';

const activate = createBoardgameStorage<number>('BOARDGAME_ACTIVATE', 0);

export function useActivate() {
  const { pathname, asPath } = useRouter();
  const isErrorPage = [pathname, asPath].some(p => p.startsWith('/error'));

  useEffect(() => {
    if (!isErrorPage) {
      const subscription = onBoardgameStorage$(activate.key).subscribe(
        ([, newValue]) => {
          // if newValue is not a number. Most likey user delete the storage
          if (typeof newValue === 'number') {
            router.push('/error/Only allow one screen at a time');
          }
        }
      );

      activate.save(+new Date());

      return () => subscription.unsubscribe();
    }
  }, [isErrorPage]);
}
