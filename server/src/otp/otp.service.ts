import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { OTP } from './otp.entity';
import { Users } from '../users/users.entity';

@Injectable()
export class OTPService {
  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async generateOTP(userId: number): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const otp = this.otpRepository.create({
      userId,
      code,
      expiresAt,
    });
    await this.otpRepository.save(otp);

    return code;
  }

  async verifyOTP(userId: number, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: {
        userId,
        code,
        used: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!otp) {
      throw new NotFoundException('OTP code is not valid');
    }

    if (new Date() > otp.expiresAt) {
      throw new BadRequestException('OTP code expired');
    }

    otp.used = true;
    await this.otpRepository.save(otp);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.isVerified = true;
    user.isActive = true;
    await this.userRepository.save(user);

    return true;
  }

  async cleanupExpiredOTPs() {
    await this.otpRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}