import { NestApplication } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { MongooseExceptionFilter } from './utils/mongoose-exception-filter';
import { ResponseInterceptor } from './utils/response.interceptor';
import { MatchModule } from './match/match.module';

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
