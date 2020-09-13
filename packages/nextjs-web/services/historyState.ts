import router from 'next/router';
import { fromEventPattern } from 'rxjs';
import { skip } from 'rxjs/operators';
import { createSessionStorage } from '@/utils/storage';

export const historyState = createSessionStorage<any>(
  'MOCK_HISTORY_STATE',
  null
);

export function pushHistoryState(state: any) {
  historyState.save(state);

  const subscription = fromEventPattern(
    handler => router.events.on('beforeHistoryChange', handler),
    handler => router.events.off('beforeHistoryChange', handler)
  )
    .pipe(skip(1))
    .subscribe(() => {
      historyState.save(null);
      subscription.unsubscribe();
    });
}
