import { IsString, IsNotEmpty } from 'class-validator';
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
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  matchID: string;

  @IsString()
  @IsNotEmpty()
  playerID: string;

  @IsString()
  @IsNotEmpty()
  playerName: string;
}
