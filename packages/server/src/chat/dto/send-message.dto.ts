import { IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  MessageStatus,
  MessageType,
  Param$SendMessage,
  Schema$ChatMessage
} from '@/typings';
import { IdentifyDto } from './identify.dto';

export class SendMessageDto
  extends IdentifyDto
  implements Schema$ChatMessage, Param$SendMessage {
  @IsString()
  id: string;

  @Exclude()
  type: MessageType.CHAT;

  @Exclude()
  status: MessageStatus;

  @IsString()
  content: string;

  @IsString()
  playerName: string;
}
