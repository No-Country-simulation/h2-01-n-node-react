import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { PREDICTION_STATUS } from '../entities/prediction.entity';

export class CreatePredictionDto {
  @ApiProperty({
    example: '2',
    description: 'Home Team score',
  })
  @IsString()
  homeScore: string;

  @ApiProperty({
    example: '2',
    description: 'Away Team score',
  })
  @IsString()
  awayScore: string;

  @ApiProperty({
    example: '2',
    description: 'User Id',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: '2',
    description: 'Fixture or match Id',
  })
  @IsString()
  fixtureId: string;

  @ApiProperty({
    example: 'true',
    description: 'Match result as draw',
  })
  @IsBoolean()
  isDraw: boolean;

  @ApiProperty({
    example: 'ACCEPTED',
    description: 'Prediction status',
  })
  status: PREDICTION_STATUS;
}
