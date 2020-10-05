import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  ValidateNested
} from 'class-validator';
import { Exclude, Transform, Type } from 'class-transformer';
import {
  SetupData,
  DTOExcluded,
  Schema$Match,
  Param$CreateMatch
} from '@/typings';
import { SetupDataDto } from './setup-data.dto';

class Excluded implements DTOExcluded<Schema$Match, Param$CreateMatch> {
  @Exclude()
  id?: undefined;

  @Exclude()
  matchID?: string;

  @Exclude()
  createdAt?: number;

  @Exclude()
  updatedAt?: number;

  @Exclude()
  gameName?: string;

  @Exclude()
  players?: any;

  @Exclude()
  gameover?: unknown;

  @Exclude()
  nextMatchID?: string;
}

class CreateMatch
  extends Excluded
  implements Partial<Omit<Param$CreateMatch, keyof Excluded>> {
  @IsOptional()
  @IsBoolean()
  unlisted?: boolean;
}

export class CreateMatchDto
  extends CreateMatch
  implements Required<Omit<Param$CreateMatch, keyof CreateMatch>> {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Transform(Number)
  numPlayers: number;

  @ValidateNested()
  @Type(() => SetupDataDto)
  setupData: SetupData;
}
