import { Exclude } from 'class-transformer';
import { Param$PlayAgain } from '@/typings';
import { IsString } from 'class-validator';

class PlayAgain implements Partial<Param$PlayAgain> {
  @Exclude()
  setupData?: any;

  @Exclude()
  numPlayers?: number;
}

export class PlayAgainDto
  extends PlayAgain
  implements Required<Omit<Param$PlayAgain, keyof PlayAgain>> {
  @IsString()
  name: string;

  @IsString()
  matchID: string;

  @IsString()
  playerID: string;

  @IsString()
  credentials: string;
}
