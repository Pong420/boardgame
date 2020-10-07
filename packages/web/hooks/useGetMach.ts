import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { RxAsyncOptions, useRxAsync } from 'use-rx-hooks';
import { getMatch } from '@/services';
import { Schema$Match, ApiError, Param$GetMatch } from '@/typings';
import { Toaster } from '@/utils/toaster';

type Options = RxAsyncOptions<Schema$Match>;

export function useGetMach({ name, matchID }: Param$GetMatch) {
  const router = useRouter();
  const { request, options } = useMemo(() => {
    const options: Options = {
      onFailure: (error: ApiError) => {
        router.push(`/lobby/${name}`);
        Toaster.apiError('Get Match Failure', error);
      }
    };
    const request = () => getMatch({ name, matchID }).then(res => res.data);
    return {
      options,
      request
    };
  }, [router, name, matchID]);

  return useRxAsync(request, options);
}
