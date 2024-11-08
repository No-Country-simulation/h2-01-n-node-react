import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import Ranks from './ranks.entities';
import { EntityManager, Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { Cron } from '@nestjs/schedule';
import { RankReset } from 'src/rank-reset/rank-reset.entity';
import { DateTime } from 'luxon';

@Injectable()
export class RanksService {
  constructor(
    @InjectRepository(Ranks)
    private ranksRepository: Repository<Ranks>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(RankReset)
    private rankResetRepository: Repository<RankReset>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async findAll() {
    const ranks = await this.ranksRepository.find();

    return { ranks };
  }

  async findOneByName(name: string) {
    const rank = await this.ranksRepository
      .createQueryBuilder('rank')
      .leftJoinAndSelect('rank.users', 'user')
      .where('rank.name = :rankName', {
        rankName: name.charAt(0).toUpperCase() + name.slice(1),
      })
      .select(['rank', 'user.id', 'user.username', 'user.image', 'user.points'])
      .orderBy('user.points', 'DESC')
      .getOne();

    return { rank };
  }

  @Cron('55 23 * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async updateUserRanks() {
    const highestScore = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.points', 'points')
      .orderBy('user.points', 'DESC')
      .take(1)
      .getRawOne();

    if (!highestScore) throw new Error('Error updating user ranks');

    const silverTopLimit = Math.floor((highestScore.points / 3) * 2);
    const silverBottomLimit = Math.floor(highestScore.points / 3);
    const bronzeTopLimit = silverBottomLimit;
    const goldBottomLimit = silverTopLimit;

    try {
      await this.entityManager.transaction(
        async (transactionManager: EntityManager) => {
          await transactionManager.update(
            Ranks,
            { name: 'Bronze' },
            { topLimit: bronzeTopLimit },
          );
          await transactionManager.update(
            Ranks,
            { name: 'Silver' },
            { bottomLimit: silverBottomLimit, topLimit: silverTopLimit },
          );
          await transactionManager.update(
            Ranks,
            { name: 'Gold' },
            { bottomLimit: goldBottomLimit },
          );

          await transactionManager
            .createQueryBuilder()
            .update(Users)
            .set({
              rank: () => {
                return `CASE 
            WHEN points < ${silverBottomLimit} THEN 'Bronze'
            WHEN points >= ${silverBottomLimit} AND points < ${silverTopLimit} THEN 'Silver'
            WHEN points >= ${silverTopLimit} THEN 'Gold'
          END`;
              },
            })
            .execute();
        },
      );
      console.log('User ranks updated successfully');
    } catch (error: any) {
      if (!highestScore) throw new Error(`Error updating user ranks: ${error}`);
    }
  }

  @Cron('10 0 * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async resetRanks() {
    const rankReset = await this.rankResetRepository.findOne({
      where: { id: 1 },
    });

    if (
      DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate() >
      DateTime.fromJSDate(rankReset.resetDate).startOf('day').toJSDate()
    ) {
      try {
        await this.entityManager.transaction(
          async (transactionManager: EntityManager) => {
            await transactionManager
              .createQueryBuilder()
              .update(Users)
              .set({
                points: () => `CASE 
                WHEN rank = 'Gold' THEN 200
                WHEN rank = 'Silver' THEN 100
                WHEN rank = 'Bronze' THEN 0
              END`,
              })
              .execute();

            await transactionManager.update(
              Ranks,
              { name: 'Bronze' },
              { topLimit: 100 },
            );
            await transactionManager.update(
              Ranks,
              { name: 'Silver' },
              { bottomLimit: 100, topLimit: 200 },
            );
            await transactionManager.update(
              Ranks,
              { name: 'Gold' },
              { bottomLimit: 200 },
            );
          },
        );

        console.log('User points and ranks reset successfully');
      } catch (error) {
        console.error(`Error resetting user points: ${error}`);
      }
    }
  }
}
