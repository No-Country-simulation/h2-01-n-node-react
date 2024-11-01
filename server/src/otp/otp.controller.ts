import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OTPService } from './otp.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generateOTP(@Request() req) {
    const code = await this.otpService.generateOTP(req.user.id);
    // Aquí podrías enviar el código por email o SMS
    return { message: 'Código OTP generado exitosamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verifyOTP(@Request() req, @Body('code') code: string) {
    const isValid = await this.otpService.verifyOTP(req.user.id, code);
    return { verified: isValid };
  }
}