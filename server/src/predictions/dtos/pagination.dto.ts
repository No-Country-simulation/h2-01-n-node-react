import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class PredictionsPaginationDTO {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  type?: 'SINGLE' | 'AGGREGATE';
}
