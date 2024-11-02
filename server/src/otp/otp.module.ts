import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTPController } from './otp.controller';
import { OTPService } from './otp.service';
import { OTP } from './otp.entity';
import { Users } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, OTP])],
  controllers: [OTPController],
  providers: [OTPService],
  exports: [OTPService],
})
export class OTPModule {}