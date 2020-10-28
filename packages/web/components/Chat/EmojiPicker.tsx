import React from 'react';
import { Picker, PickerProps } from 'emoji-mart';
import { usePreferencesState } from '@/services';
import 'emoji-mart/css/emoji-mart.css';

export interface EmojiPickerProps extends Pick<PickerProps, 'onSelect'> {}

export function EmojiPicker(props: EmojiPickerProps) {
  const { theme } = usePreferencesState();
  return (
    <Picker
      {...props}
      autoFocus
      showPreview={false}
      showSkinTones={false}
      theme={theme}
      color="var(--accent-color)"
    />
  );
}
