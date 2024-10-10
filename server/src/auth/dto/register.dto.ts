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
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(USER_ROLE)
  @IsOptional()
  role?: USER_ROLE;

  @IsEnum(USER_RANK)
  @IsOptional()
  rank?: USER_RANK;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsString()
  @IsOptional()
  image?: string;
}
