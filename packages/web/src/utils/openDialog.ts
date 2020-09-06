import React, { ComponentType, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { IDialogProps } from '@blueprintjs/core';

interface DialogProps extends IDialogProps {
  children?: ReactNode;
}

export function createOpenDialog<T extends DialogProps>(
  DialogComponent: ComponentType<T>
) {
  return function openDialog(config: Partial<T>) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    // eslint-disable-next-line no-use-before-define
    let currentConfig: Partial<T> = { ...config, onClose: close, isOpen: true };

    function destroy(...args: any[]) {
      const unmountResult = ReactDOM.unmountComponentAtNode(div);
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
      }
      if (config.onClose) {
        config.onClose(...args);
      }
    }

    function render({ children, ...props }: any) {
      setTimeout(() => {
        ReactDOM.render(
          React.createElement(DialogComponent, props, children),
          div
        );
      });
    }

    function close(...args: any[]) {
      currentConfig = {
        ...currentConfig,
        isOpen: false,
        onClosed: destroy.bind(null, ...args)
      };
      render(currentConfig);
    }

    function update(newConfig: T) {
      currentConfig = {
        ...currentConfig,
        ...newConfig
      };
      render(currentConfig);
    }

    render(currentConfig);

    return {
      destroy: close,
      update
    };
  };
}
