import { Transform } from 'class-transformer';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class FixturesPaginationDTO {
  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => value?.trim())
  date?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    value?.trim();
    return value || 'America/Argentina/Buenos_Aires';
  })
  timezone?: string;
}
