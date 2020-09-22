import { Injectable } from '@nestjs/common';
import { LobbyAPI } from 'boardgame.io';
import { MongoStore, MetadataModel, getListGamesOptsQuery } from 'bgio-mongo';
import { GetMatchesDto } from './dto';

@Injectable()
export class MatchService extends MongoStore {
  constructor() {
    super({ url: '' });
  }

  async connect() {
    return void 0;
  }

  async getMatches({ name, ...where }: GetMatchesDto) {
    const sort: keyof LobbyAPI.Match = 'createdAt';
    return await MetadataModel.find({
      unlisted: false,
      ...getListGamesOptsQuery({
        gameName: name,
        where
      })
    }).sort({ [sort]: 1 });
  }
}
