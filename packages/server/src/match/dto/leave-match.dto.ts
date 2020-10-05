import { IsString, IsNotEmpty } from 'class-validator';
import { Param$LeaveMatch } from '@/typings';

export class LeaveMatchDto implements Param$LeaveMatch {
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
