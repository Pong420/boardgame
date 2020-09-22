import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game } from 'boardgame.io';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';

@Module({})
export class MatchModule {
  static forRoot(games: Game[]): DynamicModule {
    return {
      imports: [],
      module: MongooseModule,
      providers: [MatchService, { provide: 'GAMES', useValue: games }],
      controllers: [MatchController]
    };
  }
}
