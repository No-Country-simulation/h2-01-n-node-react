import { Body, Controller, Post, Res } from '@nestjs/common';
import { RegisterUserDTO } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDTO,
    @Res() res: Response,
  ) {
    await this.usersService.create(registerUserDto);

    return res.json({ message: 'Register successful' });
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDTO, @Res() res: Response) {
    const user = await this.authService.login(loginUserDto);

    res.cookie('access_token', user.accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('environment') === 'prod',
      maxAge: this.configService.get<number>('cookieTtl'),
    });

    return res.json({ message: 'Login successful' });
  }
}
