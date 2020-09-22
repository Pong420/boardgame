import { NestApplication } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { MongooseExceptionFilter } from './utils/mongoose-exception-filter';
import { ResponseInterceptor } from './utils/response.interceptor';
import { MatchModule } from './match/match.module';
import mongoose from 'mongoose';

mongoose.set('toJSON', {
  virtuals: true, // clone '_id' to 'id'
  versionKey: false // remove '__v',
});

export function setupApp(app: NestApplication): void {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
}

@Module({
  imports: [MatchModule],
  controllers: [],
  providers: []
})
export class AppModule {}
