import React from 'react';
import { TextArea as Bp3TextArea, ITextAreaProps } from '@blueprintjs/core';

export function TextArea(props: ITextAreaProps) {
  return (
    <Bp3TextArea
      fill
      rows={4}
      autoComplete="off"
      {...props}
      {...(props &&
        props.onChange &&
        typeof props.value === 'undefined' && { value: '' })}
    />
  );
}
