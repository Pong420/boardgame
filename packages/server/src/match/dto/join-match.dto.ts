import { IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Param$JoinMatch } from '@/typings';

class JoinMatch implements Partial<Param$JoinMatch> {
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
