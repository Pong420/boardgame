import { useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { navigate } from 'gatsby';
import { createLocalStorage } from '@/utils/storage';
import { JSONParse } from '@/utils/JSONParse';

const activate = createLocalStorage<number>('BOARDGAME_ACTIVATE', 0);

export function useActivate(path: string) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscription = fromEvent<StorageEvent>(window, 'storage')
        .pipe(filter(event => event.key === activate.key))
        .subscribe(event => {
          const newValue = event.newValue && JSONParse<number>(event.newValue);
          // If newValue is not a number. May be deleted by the user
          if (typeof newValue === 'number') {
            navigate('/error/Only allow one screen at a time');
          }
        });

      if (!path.startsWith('/error')) {
        activate.save(+new Date());
      }

      return () => subscription.unsubscribe();
    }
  }, [path]);
}
