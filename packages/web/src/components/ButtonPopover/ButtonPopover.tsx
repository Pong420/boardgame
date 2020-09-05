import React from 'react';
import {
  Button,
  Popover,
  IButtonProps,
  IPopoverProps
} from '@blueprintjs/core';

export interface ButtonPopoverProps
  extends IButtonProps,
    Pick<IPopoverProps, 'position' | 'content'> {
  popoverProps?: IPopoverProps;
}

export function ButtonPopover({
  popoverProps,
  content,
  position,
  disabled,
  ...props
}: ButtonPopoverProps) {
  return (
    <Popover
      popoverClassName="button-popover"
      interactionKind="hover-target"
      hoverOpenDelay={0}
      hoverCloseDelay={0}
      content={content}
      position={position}
      disabled={disabled}
      {...popoverProps}
    >
      <Button disabled={disabled} {...props} />
    </Popover>
  );
}
