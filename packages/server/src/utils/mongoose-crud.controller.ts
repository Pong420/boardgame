import { Document, FilterQuery, UpdateQuery } from 'mongoose';
import {
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  NotFoundException
} from '@nestjs/common';
import {
  MongooseCRUDService,
  QueryDto,
  Condition
} from './mongoose-crud.service';
import { ObjectId } from '../decorators';

export { QueryDto, ObjectId, Condition };

export class MongooseCRUDController<T, D extends T & Document = T & Document> {
  constructor(private readonly service: MongooseCRUDService<T, D>) {}

  @Get()
  async findAll(@Query() query: QueryDto, ..._args: unknown[]): Promise<T[]> {
    return this.service.findAll(query as any);
  }

  @Post()
  async create(@Body() createDto: unknown, ..._args: unknown[]): Promise<T> {
    return this.service.create(createDto);
  }

  @Get(':id')
  async get(@ObjectId() id: string): Promise<T> {
    const result = await this.service.findOne({ _id: id } as FilterQuery<D>);
    if (result) {
      return result;
    }
    throw new NotFoundException();
  }

  @Patch(':id')
  async update(
    @ObjectId() id: string,
    @Body() changes: UpdateQuery<D>,
    ..._args: unknown[]
  ): Promise<T> {
    return this.service.update({ _id: id } as any, changes);
  }

  @Delete(':id')
  async delete(@ObjectId() id: string): Promise<void> {
    await this.service.delete({ _id: id } as FilterQuery<D>);
  }
}
