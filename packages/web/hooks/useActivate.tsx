import router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { createBoardgameStorage, BOARDGAME_SOTRAGE } from '@/utils/storage';
import { JSONParse } from '@/utils/JSONParse';

const activate = createBoardgameStorage<number>('BOARDGAME_ACTIVATE', 0);

export function useActivate() {
  const { pathname, asPath } = useRouter();
  const isErrorPage = [pathname, asPath].some(p => p.startsWith('/error'));

  useEffect(() => {
    const subscription = fromEvent<StorageEvent>(window, 'storage')
      .pipe(filter(event => event.key === BOARDGAME_SOTRAGE))
      .subscribe(event => {
        const newValue = event.newValue
          ? JSONParse<Record<string, unknown>>(event.newValue, {})
          : {};
        // If newValue is not a number. May be deleted by the user
        if (typeof newValue[activate.key] === 'number') {
          router.push('/error/Only allow one screen at a time');
        }
      });

    if (!isErrorPage) {
      activate.save(+new Date());
    }
    return () => subscription.unsubscribe();
  }, [isErrorPage]);
}
