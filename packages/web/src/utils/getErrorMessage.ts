import { ApiError } from '../typings';

export function getErrorMessage(error?: ApiError | string): string {
  if (typeof error === 'object' && 'response' in error && error.response) {
    const { data } = error.response;
    if (typeof data === 'string') {
      return error.response.statusText;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown';
}
