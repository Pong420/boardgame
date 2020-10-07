import router from 'next/router';
import { fromEventPattern } from 'rxjs';
import { distinctUntilChanged, skip } from 'rxjs/operators';
import { createSessionStorage } from '@/utils/storage';

export const historyState = createSessionStorage<any>(
  'MOCK_HISTORY_STATE',
  null
);

export function pushHistoryState(state: any) {
  historyState.save(state);

  const subscription = fromEventPattern<string>(
    handler => router.events.on('beforeHistoryChange', handler),
    handler => router.events.off('beforeHistoryChange', handler)
  )
    .pipe(
      distinctUntilChanged(), // for play-again
      skip(1)
    )
    .subscribe(() => {
      subscription.unsubscribe();
      historyState.save(null);
    });
}
