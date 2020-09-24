import { IsString } from 'class-validator';
import { Param$SendMessage } from '@/typings';
import { IdentifyDto } from './identify.dto';

export class SendMessageDto extends IdentifyDto implements Param$SendMessage {
  @IsString()
  content: string;
}
