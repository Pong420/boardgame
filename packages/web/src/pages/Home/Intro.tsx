import React from 'react';
import { ReactComponent as Github } from '../../assets/github.svg';

export function Intro() {
  return (
    <div className="intro">
      <div className="intro-header" />
      <div className="intro-content">
        <div className="intro-title">
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
