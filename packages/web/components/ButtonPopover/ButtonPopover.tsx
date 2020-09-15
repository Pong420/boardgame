import React from 'react';
import {
  Button,
  Popover,
  IButtonProps,
  IPopoverProps
} from '@blueprintjs/core';
import styles from './ButtonPopover.module.scss';

export interface ButtonPopoverProps
  extends IButtonProps,
    Pick<IPopoverProps, 'position' | 'content'> {
  popoverProps?: IPopoverProps;
}

export const ButtonPopover = React.forwardRef<any, ButtonPopoverProps>(
  ({ popoverProps, content, position, disabled, ...props }, ref) => {
    const button = <Button disabled={disabled} {...props} ref={ref} />;

    return content ? (
      <Popover
        popoverClassName={styles['button-popover']}
        interactionKind="hover-target"
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        content={content}
        position={position}
        disabled={disabled}
        {...popoverProps}
      >
        {button}
      </Popover>
    ) : (
      button
    );
  }
);
