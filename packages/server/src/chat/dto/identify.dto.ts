import { Identify } from '@/typings';
import { IsString } from 'class-validator';

export class IdentifyDto implements Identify {
  @IsString()
  matchID: string;

  @IsString()
  playerID: string;

  @IsString()
  credentials: string;
}
