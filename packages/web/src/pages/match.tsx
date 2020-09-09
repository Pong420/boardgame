import React from 'react';
import { RouteComponentProps } from '@/typings';
import { MatchState } from '@/services';
import { Match } from '@/components/Match';
import { Redirect } from '@/components/Redirect';

export default function (
  props: RouteComponentProps<undefined, unknown, MatchState>
) {
  const { state } = props.location;
  return state ? <Match {...state} /> : <Redirect />;
}
