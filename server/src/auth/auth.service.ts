import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { USER_ROLE } from 'src/users/users.entity';
import { JwtService } from '@nestjs/jwt';

export interface Payload {
  email: string;
  userId: number;
  role: USER_ROLE;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDTO) {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);

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
}
