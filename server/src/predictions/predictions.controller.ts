import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreatePredictionDTO } from './dtos/create-prediction.dto';

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
  findUserPredictions(@Req() req) {
    return this.predictionsService.findAllPredictionsByUserId(req.user.userId);
  }

  @Get('/user/fixture/:id')
  findAllByFixtureIdAndUserId(@Param('id') id: string, @Req() req) {
    return this.predictionsService.findAllByFixtureIdAndUserId(
      +id,
      req.user.userId,
    );
  }
}
