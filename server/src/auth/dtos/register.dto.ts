import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Match } from '../decorators/match.decorator';
import { USER_RANK, USER_ROLE } from 'src/types';

export class RegisterUserDTO {
  @ApiProperty({
    example: 'johndoe',
    description: 'Username',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'Username cannot be longer than 20 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain only letters and numbers',
  })
  username: string;

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
    example: 'password',
    description: 'Confirm password',
  })
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Confirm password must match the password' })
  confirmPassword: string;

  @ApiProperty({
    example: USER_ROLE.USER,
    description: 'User role',
    default: USER_ROLE.USER,
    required: false,
  })
  @IsEnum(USER_ROLE)
  @IsOptional()
  role?: USER_ROLE;

  @ApiProperty({
    example: USER_RANK.BRONZE,
    description: 'User rank',
    default: USER_RANK.BRONZE,
    required: false,
  })
  @IsEnum(USER_RANK)
  @IsOptional()
  rank?: USER_RANK;

  @ApiProperty({
    example: 100,
    description: 'User points',
    default: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  points?: number;

  @ApiProperty({
    example: 'https://pbs.twimg.com/media/FzRfDUNXwAA838Z.jpg',
    description: 'User image',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
