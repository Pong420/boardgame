import { Injectable, Inject } from '@nestjs/common';
import { LobbyAPI } from 'boardgame.io';
import { MongoStore, MetadataModel, getListGamesOptsQuery } from 'bgio-mongo';
import { GetMatchesDto } from './dto';

@Injectable()
export class MatchService extends MongoStore {
  constructor(@Inject('MONGODB_URI') mongoUri: string) {
    super({ url: mongoUri });
    this.connect();
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
