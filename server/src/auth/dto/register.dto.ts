import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { USER_RANK, USER_ROLE } from 'src/users/users.entity';

export class RegisterUserDTO {
  @ApiProperty({
    example: 'John',
    description: 'Name',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'example@mail.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: USER_ROLE.USER,
    description: 'User role',
    default: USER_ROLE.USER,
  })
  @IsEnum(USER_ROLE)
  @IsOptional()
  role?: USER_ROLE;

  @ApiProperty({
    example: USER_RANK.BRONZE,
    description: 'User rank',
    default: USER_RANK.BRONZE,
  })
  @IsEnum(USER_RANK)
  @IsOptional()
  rank?: USER_RANK;

  @ApiProperty({
    example: 100,
    description: 'User points',
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  points?: number;

  @ApiProperty({
    example: 'https://pbs.twimg.com/media/FzRfDUNXwAA838Z.jpg',
    description: 'User image',
  })
  @IsString()
  @IsOptional()
  image?: string;
}
