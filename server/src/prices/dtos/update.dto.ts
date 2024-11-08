import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePriceDTO {
  @ApiProperty({
    description: 'The new value of the price',
    type: Number,
    example: 4299,
  })
  @IsNumber()
  @IsNotEmpty()
  value: string;
}
