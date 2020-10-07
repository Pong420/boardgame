import {
  Injectable,
  Inject,
  ForbiddenException,
  OnModuleInit,
  NotFoundException
} from '@nestjs/common';
import { defer, Subject, timer } from 'rxjs';
import {
  exhaustMap,
  filter,
  groupBy,
  map,
  mergeMap,
  take,
  takeUntil
} from 'rxjs/operators';
import { LobbyAPI } from 'boardgame.io';
import { MongoStore, MetadataModel, getListGamesOptsQuery } from 'bgio-mongo';
import { GetMatchesDto } from './dto';
import { Identify } from '@/typings';

@Injectable()
export class MatchService extends MongoStore implements OnModuleInit {
  publicMatch$ = new Subject<string>();
  deleteMatch$ = new Subject<string>();

  constructor(@Inject('MONGODB_URI') mongoUri: string) {
    super({ url: mongoUri });
  }

  onModuleInit() {
    this.connect();

    const cancel = (flag: string) =>
      this.deleteMatch$.pipe(filter(matchID => matchID === flag));

    // For play again
    // Make the match private initially. Then make it public after a while
    // This leaves some time for the players in the same match to join the new match.
    this.publicMatch$
      .pipe(
        groupBy(matchID => matchID),
        mergeMap(group$ =>
          group$.pipe(
            exhaustMap(matchID => {
              return timer(10 * 1000).pipe(
                mergeMap(() =>
                  defer(() => this.fetch(matchID, { metadata: true })).pipe(
                    map(({ metadata }) => ({ ...metadata, matchID }))
                  )
                ),
                takeUntil(cancel(matchID))
              );
            }),
            take(1)
          )
        )
      )
      .subscribe(({ matchID, ...metadata }) => {
        this.setMetadata(matchID, {
          ...metadata,
          unlisted: false
        });
      });
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

    if (!metadata) throw new NotFoundException('Match not found');

    if (credentials !== metadata.players[playerID].credentials) {
      throw new ForbiddenException('Invalid credentials ' + credentials);
    }

    delete metadata.players[playerID].name;
    delete metadata.players[playerID].credentials;

    if (Object.values(metadata.players).some(player => player.name)) {
      await this.setMetadata(matchID, metadata);
    } else {
      await this.wipe(matchID);
      this.deleteMatch$.next(matchID);
    }
  }
}
