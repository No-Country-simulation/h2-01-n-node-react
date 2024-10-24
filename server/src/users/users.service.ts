import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { RegisterUserDTO } from 'src/auth/dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';

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

    const createdAt = DateTime.now()
      .setZone('America/Argentina/Buenos_Aires')
      .toISO();

    const user = await this.usersRepository.save({
      ...registerUserDto,
      createdAt,
    });

    return plainToInstance(Users, user);
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({
      id,
    });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }
}
