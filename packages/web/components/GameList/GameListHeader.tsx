import React from 'react';
import { Header, Blank } from '../Header';
import { Preferences } from '../Preferences';

export function GameListHeader() {
  return (
    <Header title="Games" left={<Preferences />}>
      <Blank />
    </Header>
  );
}
