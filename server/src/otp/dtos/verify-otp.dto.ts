import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyOtpDto {

  @ApiProperty({
    example: 'example@mail.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '784541',
    description: 'OTP generated',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;
}