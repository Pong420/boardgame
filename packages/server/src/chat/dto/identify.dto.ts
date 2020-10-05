import { Identify } from '@/typings';
import { IsNotEmpty, IsString } from 'class-validator';

export class IdentifyDto implements Identify {
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
