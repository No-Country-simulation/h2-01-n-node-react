import { ArrayMinSize, IsNotEmpty, IsNumber } from 'class-validator';
import { CreatePredictionDTO } from './create-prediction.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAggregatePredictionDTO {
  @ApiProperty({
    type: [CreatePredictionDTO],
    description: 'Array of predictions that form the aggregate prediction',
  })
  @IsNotEmpty()
  @ArrayMinSize(2, { message: 'At least 2 predictions are required.' })
  predictions: CreatePredictionDTO[];
}
