import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { LobbyAPI } from 'boardgame.io';
import { MongoStore, MetadataModel, getListGamesOptsQuery } from 'bgio-mongo';
import { GetMatchesDto } from './dto';
import { Identify } from '@/typings';

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
      'setupData.canceled': false,
      ...getListGamesOptsQuery({
        gameName: name,
        where
      })
    }).sort({ [sort]: 1 });
  }

  async leaveMatch({ matchID, credentials, playerID }: Identify) {
    const { metadata } = await this.fetch(matchID, {
      metadata: true
    });

    if (credentials !== metadata.players[playerID].credentials) {
      throw new ForbiddenException('Invalid credentials ' + credentials);
    }

    delete metadata.players[playerID].name;
    delete metadata.players[playerID].credentials;

    if (Object.values(metadata.players).some(player => player.name)) {
      await this.setMetadata(matchID, metadata);
    } else {
      await this.wipe(matchID);
    }
  }
}
