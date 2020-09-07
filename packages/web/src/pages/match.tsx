import React from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@/typings';
import { Match } from '@/components/Match';

interface Context {
  name: string;
}

interface State {
  playerID: string;
  credentials: string;
}

export default function (
  props: RouteComponentProps<undefined, Context, State>
) {
  const { state } = props.location;

  if (!state) {
    navigate('/');
  }

  return <Match name={props.pageContext.name} {...state} />;
}
