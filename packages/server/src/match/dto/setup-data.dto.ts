import { SetupData } from '@/typings';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsNotEmpty,
  MaxLength
} from 'class-validator';

export class SetupDataDto implements SetupData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  matchName: string;

  @IsOptional()
  @IsBoolean()
  spectate?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  description?: string;
}
