import React from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@/typings';
import { Playground } from '@/components/Playground';

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

  return <Playground name={props.pageContext.name} {...state} />;
}
