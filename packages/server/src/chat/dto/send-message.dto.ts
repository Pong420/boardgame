import { IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  MessageStatus,
  MessageType,
  Param$SendMessage,
  Schema$Message
} from '@/typings';
import { IdentifyDto } from './identify.dto';

export class SendMessageDto
  extends IdentifyDto
  implements Schema$Message, Param$SendMessage {
  @IsString()
  id: string;

  @Exclude()
  type: MessageType;

  @Exclude()
  status: MessageStatus;

  @IsString()
  content: string;
}
