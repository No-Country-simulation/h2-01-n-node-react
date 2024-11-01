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
import { DateTime } from 'luxon';
import Ranks from 'src/ranks/ranks.entities';
import { USER_ROLE } from 'src/types';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Ranks)
    private ranksRepository: Repository<Ranks>,
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

    return { user };
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) throw new UnauthorizedException('User not found');

    return { user };
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({
      id,
    });

    if (!user) throw new UnauthorizedException('User not found');

    return { user };
  }

  async findUserRank(id: number) {
    const user = await this.usersRepository.findOneBy({
      id,
    });

    if (!user) throw new UnauthorizedException('User not found');

    const rank = await this.ranksRepository
      .createQueryBuilder('rank')
      .leftJoinAndSelect('rank.users', 'user')
      .where('rank.name = :rankName', { rankName: user.rank })
      .select(['rank', 'user.id', 'user.username', 'user.image', 'user.points'])
      .orderBy('user.points', 'DESC')
      .getOne();

    return { rank };
  }

  async upgradeUserToPremium(id: number) {
    let user = await this.usersRepository.findOneBy({
      id,
    });

    if (!user) throw new UnauthorizedException('User not found');

    if (user.role === USER_ROLE.PREMIUM)
      throw new ConflictException('User is already premium');

    user.role = USER_ROLE.PREMIUM;
    user.premiumExpireDate = DateTime.now()
      .setZone('America/Argentina/Buenos_Aires')
      .plus({ month: 1 })
      .toJSDate();

    const updatedUser = await this.usersRepository.save(user);

    delete updatedUser.password;

    return { user: updatedUser };
  }

  async findAllPremiumUsers() {
    const users = await this.usersRepository.find({
      where: { role: USER_ROLE.PREMIUM },
    });

    return { users };
  }

  @Cron('5 0 * * *')
  async checkUsersExpireDate() {
    try {
      let premiumUsers = await this.usersRepository.find({
        where: { role: USER_ROLE.PREMIUM },
      });

      const today = DateTime.now()
        .setZone('America/Argentina/Buenos_Aires')
        .startOf('day');

      for (let user of premiumUsers) {
        if (
          user.premiumExpireDate &&
          user.premiumExpireDate <= today.toJSDate()
        ) {
          user.role = USER_ROLE.USER;
          user.premiumExpireDate = null;
        }
      }

      await this.usersRepository.save(premiumUsers);
      console.log(`[checkUsersExpireDate] Ran successfully`);
    } catch (error: any) {
      console.log(
        `[checkUsersExpireDate] An error occurred: ${error?.message}`,
      );
    }
  }
}
