import React from 'react';
import { RouteComponentProps } from '@/typings';
import { Invitation } from '@/components/Invitation';

export default function ({ location }: RouteComponentProps) {
  return <Invitation search={location.search.slice(1)} />;
}
