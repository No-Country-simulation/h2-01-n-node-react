import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fixtures } from './fixtures.entities';
import { Repository } from 'typeorm';
import { FixturesPaginationDTO } from './dtos/pagination.dto';
import { DateTime } from 'luxon';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { FixtureBets } from 'src/fixture-bets/fixture-bets.entity';
import { FixtureBetOdds } from 'src/fixture-bet-odds/fixture-bet-odds.entity';
@Injectable()
export class FixturesService {
  constructor(
    @InjectRepository(Fixtures)
    private fixturesRepository: Repository<Fixtures>,
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectRepository(FixtureBets)
    private fixtureBetsRepository: Repository<FixtureBets>,
    @InjectRepository(FixtureBetOdds)
    private fixtureBetOddsRepository: Repository<FixtureBetOdds>,
  ) {}

  async findAll(query: FixturesPaginationDTO) {
    let { date, timezone, order } = query;

    const queryBuilder = this.fixturesRepository
      .createQueryBuilder('fixture')
      .leftJoinAndSelect('fixture.venue', 'venue')
      .leftJoinAndSelect('fixture.league', 'league')
      .leftJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .leftJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .leftJoinAndSelect(
        'fixture.fixtureBets',
        'fixtureBet',
        '(fixtureBet.betId = :betId OR fixtureBet.id IS NULL)',
        { betId: 1 },
      )
      .leftJoinAndSelect('fixtureBet.fixtureBetOdds', 'fixtureBetOdd');

    const localDate = DateTime.fromISO(date, { zone: timezone });

    const startOfDay = localDate.startOf('day').toUTC();

    const endOfDay = localDate.endOf('day').toUTC();

    if (date && timezone) {
      queryBuilder.andWhere(
        'fixture.date >= :startOfDay AND fixture.date <= :endOfDay',
        { startOfDay: startOfDay.toISO(), endOfDay: endOfDay.toISO() },
      );
    }

    queryBuilder.andWhere(
      '(fixtureBet.betId = :betId OR fixtureBet.id IS NULL)',
      { betId: 1 },
    );

    queryBuilder.orderBy(
      'fixture.date',
      order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    );

    const fixtures = await queryBuilder.getMany();

    let nextDate = null;

    if (fixtures.length === 0) {
      const nextDateQuery = this.fixturesRepository
        .createQueryBuilder('fixture')
        .select('fixture.date')
        .where('fixture.date > :currentDate', {
          currentDate: startOfDay.toISO(),
        })
        .orderBy('fixture.date', 'ASC')
        .limit(1);

      const nextFixture = await nextDateQuery.getOne();

      if (nextFixture) {
        nextDate = DateTime.fromJSDate(nextFixture.date)
          .setZone(timezone)
          .toFormat('yyyy-MM-dd');
      }
    }

    return { fixtures, nextDate };
  }

  // TODO: future
  async findOneById(id: number) {
    const fixture = await this.fixturesRepository
      .createQueryBuilder('fixture')
      .leftJoinAndSelect('fixture.venue', 'venue')
      .leftJoinAndSelect('fixture.league', 'league')
      .leftJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .leftJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .leftJoinAndSelect(
        'fixture.fixtureBets',
        'fixtureBet',
        'fixtureBet.betId IN (:...betIds) OR fixtureBet.id IS NULL',
        {
          betIds: [1, 92],
        },
      )
      .leftJoinAndSelect('fixtureBet.fixtureBetOdds', 'fixtureBetOdd')
      // .leftJoinAndSelect(
      //   'homeTeam.playerTeamRelationships',
      //   'homePlayerTeamRelationships',
      //   `
      // homePlayerTeamRelationships.leagueId = league.id AND
      // homePlayerTeamRelationships.leagueSeason = fixture.season
      // `,
      // )
      // .leftJoinAndSelect('homePlayerTeamRelationships.player', 'homePlayer')
      // .leftJoinAndSelect(
      //   'awayTeam.playerTeamRelationships',
      //   'awayPlayerTeamRelationships',
      //   `
      // awayPlayerTeamRelationships.leagueId = league.id AND
      // awayPlayerTeamRelationships.leagueSeason = fixture.season
      // `,
      // )
      // .leftJoinAndSelect('awayPlayerTeamRelationships.player', 'awayPlayer')
      .where('fixture.id = :id', { id })
      .getOne();

    if (!fixture) throw new NotFoundException('Fixture not found');

    // let fixtureBetAnytimeScorer = fixture.fixtureBets.find((bet) => bet.id);

    // if (fixtureBetAnytimeScorer) {
    //   const homeTeamSet = new Set(
    //     fixture.homeTeam.playerTeamRelationships.map((pr) => pr.player.name),
    //   );

    //   const awayTeamSet = new Set(
    //     fixture.awayTeam.playerTeamRelationships.map((pr) => pr.player.name),
    //   );

    //   for (let player of fixtureBetAnytimeScorer.fixtureBetOdds) {
    //     const playerWithTeam = player as {
    //       value: string;
    //       team?: 'home' | 'away';
    //     };

    //     if (homeTeamSet.has(playerWithTeam.value)) {
    //       playerWithTeam.team = 'home';
    //     } else if (awayTeamSet.has(playerWithTeam.value)) {
    //       playerWithTeam.team = 'away';
    //     }
    //   }
    // }

    // delete fixture.homeTeam.playerTeamRelationships;
    // delete fixture.awayTeam.playerTeamRelationships;

    return fixture;
  }

  @Cron('55 0 * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async updateFixtures() {
    if (!this.configService.get<string>('apiKey')) return;

    const today = DateTime.now().setZone('America/Argentina/Buenos_Aires');

    const todayFormatted = today.toFormat('yyyy-MM-dd');

    const previousDay = today.minus({ days: 1 });
    const previousDayFormatted = previousDay.toFormat('yyyy-MM-dd');

    const fiveDaysFromToday = today.plus({ days: 3 });
    const fiveDaysFromTodayFormatted = fiveDaysFromToday.toFormat('yyyy-MM-dd');

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(
            `fixtures?league=128&season=2024&from=${previousDayFormatted}&to=2024-12-31`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error);
              throw 'An error happened!';
            }),
          ),
      );

      const fixtures = data.response;

      const formattedFixtures = fixtures.map((obj) => {
        const { fixture, league, teams, goals, score } = obj;

        return {
          id: fixture.id,
          referee: fixture.referee,
          timezone: fixture.timezone,
          date: fixture.date,
          timestamp: fixture.timestamp,
          firstPeriod: fixture.periods.first,
          secondPeriod: fixture.periods.second,
          venueId: fixture.venue.id,
          statusLong: fixture.status.long,
          statusShort: fixture.status.short,
          statusElapsed: fixture.status.elapsed,
          statusExtra: fixture.status.extra,
          leagueId: league.id,
          season: league.season,
          round: league.round,
          homeTeamId: teams.home.id,
          awayTeamId: teams.away.id,
          homeTeamWinner: teams.home.winner,
          awayTeamWinner: teams.away.winner,
          homeGoals: goals.home,
          awayGoals: goals.away,
          homeScoreHalftime: score.halftime.home,
          awayScoreHalftime: score.halftime.away,
          homeScoreFulltime: score.fulltime.home,
          awayScoreFulltime: score.fulltime.away,
          homeScoreExtratime: score.extratime.home,
          awayScoreExtratime: score.extratime.away,
          homeScorePenalty: score.penalty.home,
          awayScorePenalty: score.penalty.away,
        };
      });

      await this.fixturesRepository.save(formattedFixtures);
      console.log('Fixtures updated successfully.');
    } catch (error: any) {
      console.log(`Error when updating fixtures: ${error}`);
    }

    try {
      const { data: dataForToday } = await firstValueFrom(
        this.httpService
          .get(
            `/odds?league=128&season=2024&date=${todayFormatted}&timezone=America%2FArgentina%2FBuenos_Aires&bookmaker=8`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error);
              throw 'An error happened!';
            }),
          ),
      );

      const { data: dataForFiveDaysFromNow } = await firstValueFrom(
        this.httpService
          .get(
            `/odds?league=128&season=2024&date=${fiveDaysFromTodayFormatted}&timezone=America%2FArgentina%2FBuenos_Aires&bookmaker=8`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error);
              throw 'An error happened!';
            }),
          ),
      );

      const fixtureBetsForToday = dataForToday.response;
      const fixtureBetsForFiveDaysFromNow = dataForFiveDaysFromNow.response;

      const _fixtureBets = [];
      const fixtureBetOdds = [];

      for (let fixtureBet of fixtureBetsForToday) {
        for (let bookmaker of fixtureBet.bookmakers) {
          for (let bet of bookmaker.bets) {
            if (bet.id === 1 || bet.id === 92) {
              let fixtureBetId = +`${fixtureBet.fixture.id}${bet.id}`;
              const _fixtureBet = {
                id: fixtureBetId,
                leagueId: fixtureBet.league.id,
                fixtureId: fixtureBet.fixture.id,
                betId: bet.id,
              };
              _fixtureBets.push(_fixtureBet);
              for (let value of bet.values) {
                const oddValue = {
                  fixtureBetId,
                  value: value.value?.toString(),
                  odd: value.odd,
                };
                fixtureBetOdds.push(oddValue);
              }
            }
          }
        }
      }

      for (let fixtureBet of fixtureBetsForFiveDaysFromNow) {
        for (let bookmaker of fixtureBet.bookmakers) {
          for (let bet of bookmaker.bets) {
            if (bet.id === 1 || bet.id === 92) {
              let fixtureBetId = +`${fixtureBet.fixture.id}${bet.id}`;
              const _fixtureBet = {
                id: fixtureBetId,
                leagueId: fixtureBet.league.id,
                fixtureId: fixtureBet.fixture.id,
                betId: bet.id,
              };
              _fixtureBets.push(_fixtureBet);
              for (let value of bet.values) {
                const oddValue = {
                  fixtureBetId,
                  value: value.value?.toString(),
                  odd: value.odd,
                };
                fixtureBetOdds.push(oddValue);
              }
            }
          }
        }
      }

      await this.fixtureBetsRepository.save(_fixtureBets);
      await this.fixtureBetOddsRepository.save(fixtureBetOdds);

      console.log('Bets from fixtures updated successfully.');
    } catch (error: any) {
      console.log(`Error when updating bets from fixtures: ${error}`);
    }
  }
}
