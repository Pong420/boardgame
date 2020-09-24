import { APP_INTERCEPTOR } from '@nestjs/core';
import { NestApplication } from '@nestjs/core';
import { DynamicModule, Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { MongooseExceptionFilter } from './utils/mongoose-exception-filter';
import { MongooseSerializerInterceptor } from './utils/mongoose-serializer.interceptor';
import { MatchModule, MatchModuleOptions } from './match/match.module';
import { EventsModule } from './events/events.module';

export interface AppModuleOptions extends MatchModuleOptions {}

export function setupApp(app: NestApplication): void {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MongooseExceptionFilter());
}

@Module({})
export class AppModule {
  static init(options: AppModuleOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [MatchModule.forRoot(options), EventsModule.forRoot(options)],
      controllers: [],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: MongooseSerializerInterceptor
        }
      ]
    };
  }
}
