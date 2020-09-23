import { NestApplication } from '@nestjs/core';
import { DynamicModule, Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Game } from 'boardgame.io';
import { MongooseExceptionFilter } from './utils/mongoose-exception-filter';
import { MatchModule } from './match/match.module';
import { EventsModule } from './events/events.module';

export function setupApp(app: NestApplication): void {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MongooseExceptionFilter());
}

@Module({})
export class AppModule {
  static init(games: Game[]): DynamicModule {
    return {
      module: AppModule,
      imports: [MatchModule.forRoot(games), EventsModule.forRoot(games)],
      controllers: [],
      providers: []
    };
  }
}
