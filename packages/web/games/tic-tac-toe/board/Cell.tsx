import React from 'react';

export const Cell = ({ children, ...props }: JSX.IntrinsicElements['td']) => (
  <td {...props}>
    {children}
    <style jsx>{`
      .cell {
        @include sq-dimen(50px);
        border: 2px solid var(--text-color);
        cursor: default;
        font-weight: bold;
        font-size: 20px;
        user-select: none;

        &.active {
          cursor: pointer;
          background: var(--text-light-color);
        }
      }
    `}</style>
  </td>
);
