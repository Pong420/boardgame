import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import {
  MessageStatus,
  MessageType,
  Param$SendMessage,
  Schema$ChatMessage
} from '@/typings';
import { DOMPurify } from '@/utils/dompurify';
import { IdentifyDto } from './identify.dto';

export class SendMessageDto
  extends IdentifyDto
  implements Schema$ChatMessage, Param$SendMessage {
  @IsString()
  @IsNotEmpty()
  id: string;

  @Exclude()
  type: MessageType.CHAT;

  @Exclude()
  status: MessageStatus;

  @IsString()
  @IsNotEmpty()
  @Transform(dirty => DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ['#text'] }))
  content: string;

  @IsString()
  @IsNotEmpty()
  playerName: string;
}
