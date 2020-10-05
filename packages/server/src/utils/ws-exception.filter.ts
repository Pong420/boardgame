import { Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/ban-types
  handleUnknownError(exception: any, client: { emit: Function }) {
    if (
      exception &&
      exception['response'] &&
      exception['response']['statusCode']
    ) {
      const msg = exception['response']['message'];
      const [error] = Array.isArray(msg) ? msg : [msg];

      if (typeof error === 'string') {
        return this.handleError(client, new WsException(error));
      }
    }

    return super.handleUnknownError(exception, client);
  }
}
