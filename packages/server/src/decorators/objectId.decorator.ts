import {
  Param,
  PipeTransform,
  Injectable,
  BadRequestException
} from '@nestjs/common';

const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

export const IsObjectId = (value: string): boolean =>
  checkForHexRegExp.test(value);

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  constructor(private errorMessage = 'Incorrect object id format') {}
  transform(value: unknown): string {
    if (typeof value === 'string' && IsObjectId(value)) {
      return value;
    }
    throw new BadRequestException(this.errorMessage);
  }
}

export const ObjectId = (): ParameterDecorator =>
  Param('id', new ValidateObjectIdPipe());
