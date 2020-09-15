import React from 'react';
import { Switch as Bp3Switch, ISwitchProps } from '@blueprintjs/core';

export type { ISwitchProps };

export function Switch({ label, checked, onChange, ...props }: ISwitchProps) {
  return (
    <Bp3Switch
      {...props}
      alignIndicator="right"
      labelElement={label}
      onChange={onChange}
      checked={onChange && typeof checked === 'undefined' ? false : checked}
    />
  );
}
