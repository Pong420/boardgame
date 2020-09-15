import React from 'react';
import { Checkbox as Bp3Checkbox, ICheckboxProps } from '@blueprintjs/core';

export function Checkbox({
  label,
  checked,
  onChange,
  ...props
}: ICheckboxProps) {
  return (
    <Bp3Checkbox
      {...props}
      alignIndicator="right"
      labelElement={label}
      onChange={onChange}
      checked={onChange && typeof checked === 'undefined' ? false : checked}
    />
  );
}
