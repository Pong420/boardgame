import { Module, DynamicModule } from '@nestjs/common';
import { MatchModule, MatchModuleOptions } from '@/match/match.module';
import { createEventGateway } from './events.gateway';

@Module({})
export class EventsModule {
  static forRoot(options: MatchModuleOptions): DynamicModule {
    return {
      module: EventsModule,
      imports: [MatchModule.forRoot(options)],
      providers: [...options.games.map(game => createEventGateway(game))]
    };
  }
}
