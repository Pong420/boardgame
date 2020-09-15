import React, { ChangeEvent } from 'react';
import { Control } from '@/utils/form';
import { Switch, ISwitchProps } from '@/components/Input';

export function ThemeSwitch({
  value,
  onChange,
  ...props
}: ISwitchProps & Control<Theme>) {
  return (
    <Switch
      {...props}
      checked={value === 'dark' ? true : false}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange && onChange(event.target.checked ? 'dark' : 'light')
      }
    />
  );
}
