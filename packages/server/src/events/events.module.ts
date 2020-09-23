import { Module, DynamicModule } from '@nestjs/common';
import { Game } from 'boardgame.io';
// import { createEventGateway } from './events.gateway';
import { createEventGateway, EventsGateway } from './events.gateway';

@Module({})
export class EventsModule {
  static forRoot(games: Game[]): DynamicModule {
    return {
      module: EventsModule,
      providers: [
        EventsGateway,
        ...games.map(game => createEventGateway(game.name))
      ]
    };
  }
}
