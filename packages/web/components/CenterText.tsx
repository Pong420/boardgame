import React from 'react';

interface Props {
  text: string;
}

export function CenterText({ text }: Props) {
  return (
    <div className="center-text">
      {text}
      <style jsx>
        {`
          .center-text {
            @include sq-dimen(100%);
            @include flex(center, center);
            @include ink-painting;
            font-size: 40px;
          }
        `}
      </style>
    </div>
  );
}

export const Loading = () => <CenterText text="Loading..." />;
export const Disconnected = () => <CenterText text="Connecting..." />;
