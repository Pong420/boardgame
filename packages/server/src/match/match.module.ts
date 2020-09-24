import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game } from 'boardgame.io';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';

export interface MatchModuleOptions {
  games: Game[];
  mongoUri: string;
}

@Module({})
export class MatchModule {
  static forRoot({ games, mongoUri }: MatchModuleOptions): DynamicModule {
    return {
      imports: [],
      module: MongooseModule,
      providers: [
        MatchService,
        { provide: 'GAMES', useValue: games },
        { provide: 'MONGODB_URI', useValue: mongoUri }
      ],
      exports: [MatchService],
      controllers: [MatchController]
    };
  }
}
