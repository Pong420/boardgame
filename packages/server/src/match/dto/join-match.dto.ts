import { IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { DTOExcluded, Schema$Match, Param$JoinMatch } from '@/typings';

class Excluded implements DTOExcluded<Schema$Match, Param$JoinMatch> {
  @Exclude()
  id: undefined;

  @Exclude()
  createdAt: undefined;

  @Exclude()
  updatedAt: undefined;

  @Exclude()
  gameName: undefined;

  @Exclude()
  players: undefined;

  @Exclude()
  gameover: undefined;

  @Exclude()
  nextMatchID: undefined;

  @Exclude()
  setupData: undefined;

  @Exclude()
  unlisted: undefined;
}

class JoinMatch
  extends Excluded
  implements Partial<Omit<Param$JoinMatch, keyof Excluded>> {
  @Exclude()
  data: unknown;
}

export class JoinMatchDto
  extends JoinMatch
  implements Required<Omit<Param$JoinMatch, keyof JoinMatch>> {
  @IsString()
  name: string;

  @IsString()
  matchID: string;

  @IsString()
  playerID: string;

  @IsString()
  playerName: string;
}
