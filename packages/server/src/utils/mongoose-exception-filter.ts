import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { FastifyReply } from 'fastify';
import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
  HttpException
} from '@nestjs/common';

export function handleMongoError(
  error: unknown
): [keyof typeof HttpStatus, string] | undefined {
  if (error instanceof MongooseError.CastError) {
    if (error.path === '_id') {
      return ['BAD_REQUEST', 'Incorrect id'];
    }
    return [
      'BAD_REQUEST',
      `Cast to '${error.kind}' failed for value '${error.value}' at path '${error.path}'`
    ];
  }

  if (error instanceof MongoError) {
    switch (error.code) {
      case 11000:
        return [
          'BAD_REQUEST',
          'keyValue' in error
            ? `${Object.keys((error as any).keyValue).join(',')} already used`
            : 'DuplicateKey'
        ];
    }
  }
}

export function throwMongoError(error: unknown): void {
  const [type, message] = handleMongoError(error) || [];
  if (typeof type !== 'undefined') {
    throw new HttpException(message, HttpStatus[type]);
  }
}

@Catch(MongoError, MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const [type, message] = handleMongoError(exception) || [];

    if (typeof type !== 'undefined') {
      const status = HttpStatus[type];
      response.status(status).send({
        statusCode: status,
        message
      });
    }
  }
}
