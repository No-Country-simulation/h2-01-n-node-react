import { Transform } from 'class-transformer';
import { IsISO8601, IsNotEmpty } from 'class-validator';
import { IsFutureDate } from '../decorators/future-date.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';

export class UpdateRankResetDTO {
  @ApiProperty({
    description: 'The date for the rank reset in ISO 8601 format.',
    type: String,
    example: '2024-11-30',
  })
  @IsISO8601()
  @IsNotEmpty()
  @IsFutureDate({ message: 'The date must be a future date' })
  @Transform(({ value }) => {
    value.trim();
    return DateTime.fromISO(value, {
      zone: 'America/Argentina/Buenos_Aires',
    }).toFormat('yyyy-MM-dd');
  })
  date: string;
}
