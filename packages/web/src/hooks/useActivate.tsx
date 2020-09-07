import { useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { navigate } from 'gatsby';
import { createLocalStorage } from '@/utils/storage';

const activate = createLocalStorage<number>('BOARDGAME_ACTIVATE', 0);

export function useActivate(path: string) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscription = fromEvent<StorageEvent>(window, 'storage').subscribe(
        () => {
          navigate('/error/Only allow one screen at a time');
        }
      );

      if (!path.startsWith('/error')) {
        activate.save(+new Date());
      }

      return () => subscription.unsubscribe();
    }
  }, [path]);
}
