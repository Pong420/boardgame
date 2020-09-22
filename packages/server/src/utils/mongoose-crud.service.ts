import {
  Document,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  Model
} from 'mongoose';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import { Pagination, Search, Timestamp } from '../typings';
import { Condition } from './format-search-query';
import { DateRannge } from '../decorators/range.decorator';

export { Condition };

type QuerySchema = {
  [K in keyof (Pagination & Search & Timestamp)]?: unknown;
};

interface MongoDateRange {
  $gte: string;
  $lte: string;
}

class Base implements QuerySchema {
  @IsNumber()
  @IsOptional()
  @Transform(Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform(Number)
  size?: number;

  @IsOptional()
  sort?: Pagination['sort'];

  @Exclude()
  condition?: Condition[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @ValidateNested()
  @DateRannge()
  createdAt?: MongoDateRange;

  @IsOptional()
  @ValidateNested()
  @DateRannge()
  updatedAt?: MongoDateRange;
}

export class QueryDto
  extends Base
  implements Required<Omit<QuerySchema, keyof Base>> {}

interface Options<T> {
  searchKeys?: (keyof T)[];
}

export class MongooseCRUDService<T, D extends T & Document = T & Document> {
  constructor(
    private model: Model<D>,
    private readonly options: Options<T> = {}
  ) {}

  async create(createDto: unknown): Promise<T> {
    const created = new this.model(createDto);
    return created.save();
  }

  async delete(query: FilterQuery<D>): Promise<void> {
    await this.model.deleteOne(query);
  }

  async update(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options?: QueryFindOneAndUpdateOptions
  ): Promise<T> {
    return this.model.findOneAndUpdate(query, changes, {
      ...options,
      new: true
    });
  }

  async findOne(
    { id, ...query }: FilterQuery<T>,
    projection: any = ''
  ): Promise<T> {
    return this.model.findOne(
      JSON.parse(JSON.stringify({ _id: id, ...query })),
      projection
    );
  }

  async findAll(query?: FilterQuery<D>): Promise<T[]> {
    return this.model.find(query).exec();
  }

  async clear(): Promise<void> {
    await this.model.deleteMany({});
  }
}
