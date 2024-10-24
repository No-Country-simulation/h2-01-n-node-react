import { IsInt, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateAchievementDTO {

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    @Max(30)
    clubRanking: number;

    @ApiProperty({ example: 'UEFA' })
    @IsString()
    confederation: string;

    @ApiProperty({ example: 'LaLiga' })
    @IsString()
    league: string;

    @ApiProperty({ example: 35 })
    @IsInt()
    matchesPlayed: number;

    @ApiProperty({ example: 50 })
    @IsInt()
    totalClubMatches: number;

    @ApiProperty({ example: 25 })
    @IsInt()
    goals: number;

    @ApiProperty({ example: 10 })
    @IsInt()
    assists: number;

    @ApiProperty({ example: 9 })
    @IsNumber()
    rating: number;
    }

