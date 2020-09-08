import React from 'react';
import { Github } from '../Github';

export function Home() {
  return (
    <div className="home">
      <div className="home-header" />
      <div className="home-content">
        <div className="home-title">
          Let's Play
          <br />
          Boardgame
        </div>

        <Github />
      </div>
    </div>
  );
}
