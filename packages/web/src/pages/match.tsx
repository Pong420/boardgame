import React from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@/typings';
import { Match } from '@/components/Match';
import { PlayerState } from '@/services';

export default function (
  props: RouteComponentProps<undefined, unknown, PlayerState>
) {
  const { state } = props.location;

  if (!state) {
    navigate('/');
  }

  return state ? <Match {...state} /> : null;
}
