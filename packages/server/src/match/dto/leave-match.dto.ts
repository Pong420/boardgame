import { Param$LeaveMatch } from '@/typings';
import { IsString } from 'class-validator';

export class LeaveMatchDto implements Param$LeaveMatch {
  @IsString()
  name: string;

  @IsString()
  matchID: string;

  @IsString()
  playerID: string;

  @IsString()
  credentials: string;
}
