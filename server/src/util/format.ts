export const formatFixtures = (fixtures: any[]) => {
  return fixtures.map((obj) => {
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
};

export const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
