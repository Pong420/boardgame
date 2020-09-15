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
    let currentConfig: Partial<T> = {
      ...config,
      onClose: close,
      onClosed: (...args) => {
        config.onClosed && config.onClosed(...args);
        destroy();
      },
      isOpen: true
    };

    function destroy() {
      const unmountResult = ReactDOM.unmountComponentAtNode(div);
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    }

    function render({ children, ...props }: any) {
      ReactDOM.render(
        React.createElement(DialogComponent, { ...props }, children),
        div
      );
    }

    function close() {
      currentConfig = {
        ...currentConfig,
        isOpen: false
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
