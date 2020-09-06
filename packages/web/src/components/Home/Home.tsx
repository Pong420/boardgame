import React from 'react';
import Github from '../../assets/github.svg';

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
        <a
          href="https://github.com/Pong420/Boardgame"
          target="_blank"
          rel="noopener noreferrer"
          className="github"
        >
          <Github />
        </a>
      </div>
    </div>
  );
}
