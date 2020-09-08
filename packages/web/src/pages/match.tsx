import React from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@/typings';
import { Match, MatchProps } from '@/components/Match';

export default function (
  props: RouteComponentProps<undefined, unknown, MatchProps>
) {
  const { state } = props.location;

  if (!state) {
    navigate('/');
  }

  return state ? <Match {...state} /> : null;
}
