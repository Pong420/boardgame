import { Param$JoinChat } from '@/typings';
import { IsString } from 'class-validator';
import { IdentifyDto } from './identify.dto';

export class JoinChatDto extends IdentifyDto implements Param$JoinChat {
  @IsString()
  playerName: string;
}
