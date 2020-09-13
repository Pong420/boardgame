import React from 'react';
import {
  Tag,
  InputGroup,
  HTMLInputProps,
  IInputGroupProps
} from '@blueprintjs/core';

export interface InputProps
  extends IInputGroupProps,
    Omit<HTMLInputProps, 'value' | 'defaultValue' | 'onChange'> {}

export const unitProps = (unit: string) => ({
  rightElement: <Tag>{unit}</Tag>
});

export function Input(props?: InputProps) {
  return (
    <InputGroup
      fill
      autoComplete="off"
      {...props}
      {...(props &&
        props.onChange &&
        typeof props.value === 'undefined' && { value: '' })}
    />
  );
}
