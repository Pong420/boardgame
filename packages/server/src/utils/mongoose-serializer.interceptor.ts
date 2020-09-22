import { classToPlain } from 'class-transformer';
import { isObject } from 'class-validator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Model } from 'mongoose';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  PlainLiteralObject,
  ExecutionContext,
  NestInterceptor,
  CallHandler,
  Inject,
  Optional,
  Type,
  Scope
} from '@nestjs/common';
import { CLASS_SERIALIZER_OPTIONS } from '@nestjs/common/serializer/class-serializer.constants';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { PaginateResult, UserRole } from '@fullstack/typings';

type Res =
  | PlainLiteralObject
  | Array<PlainLiteralObject>
  | PaginateResult<unknown>;

@Injectable({ scope: Scope.REQUEST })
export class MongooseSerializerInterceptor implements NestInterceptor {
  constructor(
    @Inject(Reflector) protected readonly reflector: Reflector,
    @Optional() protected readonly defaultOptions: ClassTransformOptions = {}
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this.getContextOptions(context);
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const role = UserRole[req?.user?.role];

    const options = {
      ...this.defaultOptions,
      ...contextOptions
    };

    return next.handle().pipe(
      map((res: Res) =>
        this.serialize(res, {
          ...options,
          groups: [...(options.groups || []), role]
        })
      )
    );
  }

  serialize(
    response: Res,
    options: ClassTransformOptions
  ): PlainLiteralObject | PlainLiteralObject[] {
    const isArray = Array.isArray(response);
    if (!isObject(response) && !isArray) {
      return response;
    }

    if ('data' in response && 'total' in response) {
      return {
        ...response,
        data: response.data.map((item: PlainLiteralObject) =>
          this.transformToPlain(item, options)
        )
      };
    }

    return isArray
      ? (response as PlainLiteralObject[]).map(item =>
          this.transformToPlain(item, options)
        )
      : this.transformToPlain(response, options);
  }

  transformToPlain(
    plainOrClass: unknown,
    options: ClassTransformOptions
  ): PlainLiteralObject {
    if (plainOrClass instanceof Model) {
      plainOrClass = plainOrClass.toJSON();
    }
    return plainOrClass && plainOrClass.constructor !== Object
      ? classToPlain(plainOrClass, options)
      : plainOrClass;
  }

  getContextOptions(
    context: ExecutionContext
  ): ClassTransformOptions | undefined {
    return (
      this.reflectSerializeMetadata(context.getHandler()) ||
      this.reflectSerializeMetadata(context.getClass())
    );
  }

  reflectSerializeMetadata(
    // eslint-disable-next-line @typescript-eslint/ban-types
    obj: Function | Type<any>
  ): ClassTransformOptions | undefined {
    return this.reflector.get(CLASS_SERIALIZER_OPTIONS, obj);
  }
}
