import { ApiError } from '@/typings';

export function getErrorMessage(error: ApiError): string {
  if (error.response) {
    const { data } = error.response;
    if (typeof data === 'string') {
      return error.response.statusText;
    }
    const { message } = data;
    return Array.isArray(message) ? message[0] : message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown';
}
