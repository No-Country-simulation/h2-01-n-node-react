import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OTPService } from './otp.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('OTP Verification')
@Controller('otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generateOTP(@Request() req) {
    const code = await this.otpService.generateOTP(req.user.id);
    return { message: 'OTP code generated successfully. Check your email' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verifyOTP(@Request() req, @Body('code') code: string) {
    const isValid = await this.otpService.verifyOTP(req.user.id, code);
    return { verified: isValid };
  }
}