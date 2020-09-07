import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@/typings';
import { Match } from '@/components/Match';
import { matchStorage, PlayerState } from '@/services';

export default function (
  props: RouteComponentProps<undefined, unknown, PlayerState>
) {
  const { state } = props.location;

  useEffect(() => {
    state ? matchStorage.save(state) : navigate('/');
  }, [state]);

  return state ? <Match {...state} /> : null;
}
