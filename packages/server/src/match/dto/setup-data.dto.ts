import { SetupData } from '@/typings';
import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class SetupDataDto implements SetupData {
  @IsString()
  // TODO: max length
  matchName: string;

  @IsOptional()
  @IsBoolean()
  spectate?: boolean;

  @IsString()
  @IsOptional()
  // TODO: max length
  description?: string;
}
