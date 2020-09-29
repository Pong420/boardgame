import { Param$GetMatch } from '@/typings';
import { IsString } from 'class-validator';

export class SpectateDto implements Param$GetMatch {
  @IsString()
  name: string;

  @IsString()
  matchID: string;
}
