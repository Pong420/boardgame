import React from 'react';

export const Text = ({ children, ...props }: JSX.IntrinsicElements['div']) => (
  <div {...props}>
    {children}
    <style jsx>{`
      div {
        font-weight: bold;
        font-size: 18px;
        min-height: 50px;
        line-height: 50px;
      }
    `}</style>
  </div>
);
