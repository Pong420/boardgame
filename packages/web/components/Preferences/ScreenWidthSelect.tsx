import React from 'react';
import { HTMLSelect, IHTMLSelectProps } from '@blueprintjs/core';
import { ScreenWidth } from '@/services';

const options: Array<{ value: ScreenWidth; label: string }> = [
  { label: 'Stretch', value: 'stretch' },
  { label: 'Limited', value: 'limited' }
];

export function ScreenWidthSelect(props: IHTMLSelectProps) {
  return <HTMLSelect {...props} options={options} />;
}
