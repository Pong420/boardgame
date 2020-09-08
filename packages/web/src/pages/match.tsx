import React from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@/typings';
import { MatchState } from '@/services';
import { Match } from '@/components/Match';

export default function (
  props: RouteComponentProps<undefined, unknown, MatchState>
) {
  const { state } = props.location;

  if (!state) {
    navigate('/');
  }

  return state ? <Match {...state} /> : null;
}
