import { createElement, Fragment, ReactNode } from 'react';
import { Subject, timer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import {
  Position,
  Intent,
  IToastProps,
  IToasterProps,
  IToastOptions,
  Toaster as BpToaster,
  IToaster
} from '@blueprintjs/core';
import { ApiError } from '../typings';
import { getErrorMessage } from './getErrorMessage';

const props: IToasterProps = {
  position: Position.TOP_RIGHT
};

const defaultOptions: Omit<IToastOptions, 'message'> = {
  timeout: 4000
};

const toaster =
  typeof document !== 'undefined'
    ? BpToaster.create(props, document.body)
    : undefined;

const toasterSubject = new Subject<IToastProps>();
toasterSubject
  .pipe(
    concatMap(props => {
      (toaster as IToaster).show(props);
      return timer(500);
    })
  )
  .subscribe();

function renderMessage(titile = '', message: ReactNode = '') {
  return createElement(
    Fragment,
    null,
    createElement('div', null, titile),
    createElement('div', null, message)
  );
}

export const Toaster = {
  success(options: IToastOptions) {
    toasterSubject.next({
      ...defaultOptions,
      ...options,
      icon: 'tick-circle',
      intent: Intent.SUCCESS,
      message: renderMessage('Success', options.message)
    });
  },
  failure(options: IToastOptions) {
    toasterSubject.next({
      ...defaultOptions,
      ...options,
      icon: 'error',
      intent: Intent.DANGER,
      message: renderMessage('Error', options.message)
    });
  },
  apiError(prefix = '', error: ApiError | string) {
    toasterSubject.next({
      ...defaultOptions,
      className: 'api-error-toaster',
      icon: 'error',
      intent: Intent.DANGER,
      message: renderMessage(
        prefix || 'Error',
        typeof error === 'string' ? error : getErrorMessage(error)
      )
    });
  },
  info(options: IToastOptions) {
    toasterSubject.next({
      ...defaultOptions,
      ...options,
      icon: 'info-sign',
      intent: Intent.PRIMARY,
      message: renderMessage('Info', options.message)
    });
  }
};
