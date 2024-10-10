import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDTO } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDTO) {
    return this.usersService.create(registerUserDto);
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  login(@Body() loginUserDto: LoginUserDTO) {
    return this.usersService.login(loginUserDto);
  }
}
