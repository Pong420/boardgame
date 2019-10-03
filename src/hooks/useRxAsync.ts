import { useEffect, useCallback, useReducer, useRef, Reducer } from 'react';
import { from, Subscription, Observable, ObservableInput } from 'rxjs';

type AsyncFn<T> = () => ObservableInput<T>;

export interface RxAsyncOptions<I, O = I> {
  initialValue?: O;
  defer?: boolean;
  pipe?: (ob: Observable<I>) => Observable<O>;
  onSuccess?(value: O): void;
  onFailure?(error: any): void;
}

export interface RxAsyncState<T> extends State<T> {
  run: () => void;
  cancel: () => void;
}

interface State<T> {
  loading: boolean;
  error?: any;
  data?: T;
}

type Actions<T> =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_FAILURE'; payload?: any }
  | { type: 'CANCEL' };

const initialArg: State<unknown> = { loading: false };

function reducer<T>(state: State<T>, action: Actions<T>): State<T> {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...initialArg, loading: true, data: state.data };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'CANCEL':
      return { ...state, loading: false };
    default:
      throw new Error();
  }
}

export function useRxAsync<T, O = T>(
  fn: AsyncFn<O>,
  options?: RxAsyncOptions<T, O> & { initialValue?: undefined }
): RxAsyncState<O>;

export function useRxAsync<T, O = T>(
  fn: AsyncFn<O>,
  options?: RxAsyncOptions<T, O> & { initialValue: O }
): RxAsyncState<O> & { data: O };

export function useRxAsync<T, O = T>(
  fn: AsyncFn<O>,
  options: RxAsyncOptions<T, O> = {}
): RxAsyncState<O> {
  const { defer, pipe, initialValue, onSuccess, onFailure } = options;
  const [state, dispatch] = useReducer<Reducer<State<O>, Actions<O>>>(reducer, {
    ...initialArg,
    data: initialValue
  });
  const subscription = useRef(new Subscription());

  const run = useCallback(() => {
    dispatch({ type: 'FETCH_INIT' });

    let source$: Observable<any> = from(fn());

    if (pipe) {
      source$ = source$.pipe(pipe);
    }

    const newSubscription = source$.subscribe(
      payload => {
        dispatch({ type: 'FETCH_SUCCESS', payload });
        onSuccess && onSuccess(payload);
      },
      payload => {
        dispatch({ type: 'FETCH_FAILURE', payload });
        onFailure && onFailure(payload);
      }
    );

    subscription.current.unsubscribe();
    subscription.current = newSubscription;
  }, [fn, pipe, onSuccess, onFailure]);

  const cancel = useCallback(() => {
    subscription.current.unsubscribe();
    dispatch({ type: 'CANCEL' });
  }, [dispatch, subscription]);

  useEffect(() => {
    !defer && run();
  }, [dispatch, run, defer]);

  return { ...state, run, cancel };
}
