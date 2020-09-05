import React from 'react';
import { Card } from '@blueprintjs/core';
import { Match } from '../../typings';

interface Props extends Match {}

export function MatchItem({ matchID }: Props) {
  return <Card className="match-item">{matchID}</Card>;
}
