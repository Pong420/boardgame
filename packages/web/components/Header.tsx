import React, { ReactNode } from 'react';
import { Button } from '@blueprintjs/core';

export const Blank = () => (
  <Button minimal icon="blank" style={{ visibility: 'hidden' }} />
);

export interface HeaderProps {
  title?: ReactNode;
  left?: ReactNode;
  children?: ReactNode;
}

export function Header({ title, left, children }: HeaderProps) {
  const buttons = Array.isArray(children)
    ? children.filter(el => React.isValidElement(el))
    : [];

  return (
    <div className="header">
      <div>
        {left}
        {buttons.slice(1).map((_, idx) => (
          <Blank key={idx} />
        ))}
      </div>
      <div className="header-title">{title}</div>
      <div>{children}</div>
      <style jsx>
        {`
          .header {
            @include header;
            flex: 0 0 auto;
          }

          .header-title {
            @include header-title;
            text-align-last: center;
          }
        `}
      </style>
    </div>
  );
}
