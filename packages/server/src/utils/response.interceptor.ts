import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@fullstack/typings';

export function transformResponse<T>(
  statusCode: number,
  data: T
): ApiResponse<T> {
  return {
    statusCode,
    data
  };
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const reply = http.getResponse<FastifyReply>();

    return next
      .handle()
      .pipe(map(data => transformResponse(reply.res.statusCode, data)));
  }
}
