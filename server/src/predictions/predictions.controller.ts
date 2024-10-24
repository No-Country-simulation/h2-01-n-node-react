import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreatePredictionDTO } from './dtos/create-prediction.dto';
import { PredictionsPaginationDTO } from './dtos/pagination.dto';

@ApiTags('Predictions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('predictions')
export class PredictionsController {
  constructor(private predictionsService: PredictionsService) {}

  @Post()
  createPrediction(
    @Body() createPredictionDto: CreatePredictionDTO,
    @Req() req,
  ) {
    return this.predictionsService.createPrediction(
      createPredictionDto,
      req.user.userId,
    );
  }

  @Get('/user')
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description:
      'Specifies the type of predictions to retrieve. Use "single" to fetch only predictions that do not point to aggregate predictions. Use "aggregate" to fetch only aggregate predictions along with their corresponding single predictions. If omitted, both types will be returned by default.',
    enum: ['single', 'SINGLE', 'aggregate', 'AGGREGATE'],
  })
  findUserPredictions(@Req() req, @Query() query: PredictionsPaginationDTO) {
    return this.predictionsService.findAllByUserId(req.user.userId, query);
  }

  @Get('/user/count')
  countUserPredictionsForNextWeek(@Req() req) {
    return this.predictionsService.countUserPredictionsForNextWeek(
      req.user.userId,
    );
  }

  @Get('/user/fixture/:id')
  findAllByFixtureIdAndUserId(@Param('id') id: string, @Req() req) {
    return this.predictionsService.findAllByFixtureIdAndUserId(
      +id,
      req.user.userId,
    );
  }
}
