import { Controller, Post, Body } from '@nestjs/common';
import { State } from 'boardgame.io';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('create')
  createMatch(@Body() metadata: CreateMatchDto) {
    return this.matchService.createGame(String(Date.now()), {
      initialState: {} as State,
      metadata
    });
  }
}
