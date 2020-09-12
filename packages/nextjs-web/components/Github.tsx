import React, { AnchorHTMLAttributes } from 'react';
import GithubIcon from '../assets/github.svg';

export function Github(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      href="https://github.com/Pong420/Boardgame"
      target="_blank"
      rel="noopener noreferrer"
    >
      <GithubIcon />
    </a>
  );
}
