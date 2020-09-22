import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Match, MatchSchema } from './schemas/match.schema';

@Module({
  imports: [],
  providers: [MatchService],
  controllers: [MatchController]
})
export class MatchModule {}
