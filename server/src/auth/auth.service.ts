import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDTO } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { USER_ROLE } from 'src/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { OTPService } from 'src/otp/otp.service';
import { UsersService } from 'src/users/users.service';

export interface Payload {
  email: string;
  userId: number;
  role: USER_ROLE;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private userService: UsersService,
    private jwtService: JwtService,
    private otpService: OTPService
  ) {}

  async login(loginUserDto: LoginUserDTO) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginUserDto.email })
      .getOne();

    const passwordsMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordsMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload: Payload = {
      email: user.email,
      userId: user.id,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async verifyOTP(email: string, code: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValid = await this.otpService.verifyOTP(user.user.id, code);
    if (isValid) {
      await this.userService.verifyUser(user.user.id);
    }
  }
}
