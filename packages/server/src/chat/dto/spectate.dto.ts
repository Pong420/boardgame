import { Param$GetMatch } from '@/typings';
import { IsString, IsNotEmpty } from 'class-validator';

export class SpectateDto implements Param$GetMatch {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  matchID: string;
}
