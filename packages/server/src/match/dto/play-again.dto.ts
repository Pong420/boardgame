import { Exclude } from 'class-transformer';
import { Param$PlayAgain } from '@/typings';
import { IsString, IsNotEmpty } from 'class-validator';

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
  credentials: string;
}
