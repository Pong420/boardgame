import { Param$GetMatches } from '@/typings';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetMatchesDto implements Param$GetMatches {
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isGameover?: boolean;

  @IsOptional()
  @IsNumber()
  updatedBefore?: number;

  @IsOptional()
  @IsNumber()
  updatedAfter?: number;
}
