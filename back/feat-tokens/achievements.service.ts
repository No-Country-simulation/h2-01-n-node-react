import { Injectable } from '@nestjs/common';
import { CalculateAchievementDTO } from './dto/calculate-achievement.dto';

@Injectable()
export class AchievementsService {

    private rankingsClub = {
    1: 0.10,   2: 0.0967,  3: 0.0933,  4: 0.09,   5: 0.0867,
    6: 0.0833, 7: 0.08,    8: 0.0767,  9: 0.0733, 10: 0.07,
    // hasta el club 30...
    };

    private confederationsMultipliers = {
    UEFA: 0.50,
    CONMEBOL: 0.33,
    CONCACAF: 0.15,
    AFC: 0.15,
    CAF: 0.10,
    OFC: 0.00,
    };

    private leaguesMultipliers = {
    PremierLeague: 0.20,
    LaLiga: 0.18,
    SerieA: 0.16,
    Bundesliga: 0.14,
    Ligue1: 0.12,
    PrimeiraLiga: 0.10,
    Eredivisie: 0.08,
    Brasileirao: 0.06,
    SuperligaArgentina: 0.04,
    MLS: 0.02,
    };

    calculateAchievement(params: CalculateAchievementDTO) {
    const { clubRanking, confederation, league, matchesPlayed, totalClubMatches, goals, assists, rating } = params;

    // Fórmula de quema por club
    const quemaClub = this.rankingsClub[clubRanking] || 0;
    const multiplicadorConfederacion = this.confederationsMultipliers[confederation] || 0;
    const quemaPorClub = quemaClub * (1 + multiplicadorConfederacion);

    // Quema por partidos jugados
    const G = matchesPlayed / totalClubMatches;
    const quemaPorPartidos = G * quemaPorClub;

    // Quema por calificación promedio
    const multiplicadorLiga = this.leaguesMultipliers[league] || 0;
    const quemaPorCalificacion = rating * G * (1 + multiplicadorLiga);

    // Quema por goles y asistencias
    const quemaPorGoles = goals * 0.005;
    const quemaPorAsistencias = assists * 0.003;

    // Calcular el total de quema
    const quemaTotal = quemaPorClub + quemaPorPartidos + quemaPorCalificacion + quemaPorGoles + quemaPorAsistencias;

    return {
        quemaPorClub: quemaPorClub.toFixed(2),
        quemaPorPartidos: quemaPorPartidos.toFixed(2),
        quemaPorCalificacion: quemaPorCalificacion.toFixed(2),
        quemaPorGoles: quemaPorGoles.toFixed(2),
        quemaPorAsistencias: quemaPorAsistencias.toFixed(2),
        quemaTotal: quemaTotal.toFixed(2),
        };
    }
}
