import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { RegisterUserDTO } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from 'src/auth/dto/login.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  async create(registerUserDto: RegisterUserDTO) {
    const userExists = await this.usersRepository.findOneBy({
      email: registerUserDto.email,
    });

    if (userExists) throw new ConflictException('User already exists');

    const salt = await bcrypt.genSalt();
    registerUserDto.password = await bcrypt.hash(
      registerUserDto.password,
      salt,
    );
    const user = await this.usersRepository.save(registerUserDto);

    return plainToInstance(Users, user);
  }

  async login(loginUserDto: LoginUserDTO) {
    const user = await this.usersRepository.findOneBy({
      email: loginUserDto.email,
    });

    if (!user) throw new UnauthorizedException('User not found');

    const passwordMatches = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid email/password');

    return user;
  }
}
