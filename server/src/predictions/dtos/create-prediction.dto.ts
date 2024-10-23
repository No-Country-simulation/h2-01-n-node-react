import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePredictionDTO {
  @ApiProperty({
    example: 'Home',
    description: 'Type of bet',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    example: '5.00',
    description: 'Odds of bet',
  })
  @IsString()
  @IsNotEmpty()
  odd: string;

  @ApiProperty({
    example: 1,
    description: 'ID of bet',
  })
  @IsNumber()
  @IsNotEmpty()
  betId: number;

  @ApiProperty({
    example: 198772,
    description: 'ID of fixture',
  })
  @IsNumber()
  @IsNotEmpty()
  fixtureId: number;
}
