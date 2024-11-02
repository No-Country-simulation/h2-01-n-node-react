import { IsString, Length } from "class-validator";

export class VerifyOtpDto {
  @IsString()
  @Length(6, 6)
  code: string;
}