import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { ApiTags } from '@nestjs/swagger';
import { CalculateAchievementDTO } from './dto/calculate-achievement.dto';

@ApiTags('Achievements')
@Controller('achievements')
export class AchievementsController {
    constructor(private achievementsService: AchievementsService) {}

    @Get('calculate')
    @UsePipes(new ValidationPipe({ transform: true }))  // Usa ValidationPipe para transformar y validar el DTO
    calculateAchievement(@Query() params: CalculateAchievementDTO) {
        return this.achievementsService.calculateAchievement(params);
    }
}


