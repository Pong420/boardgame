import React from 'react';
import { RouteComponentProps } from '@/typings';
import { Lobby } from '@/components/Lobby';
import { Redirect } from '@/components/Redirect';
import { gameMetaMap } from '@/games';

interface Props extends RouteComponentProps {
  name?: string;
}

export default function (props: Props) {
  const meta = props.name && gameMetaMap[props.name];
  return meta ? <Lobby meta={meta} /> : <Redirect />;
}
