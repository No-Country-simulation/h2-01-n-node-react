import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
    this.predictionsService.createPrediction(
      createPredictionDto,
      req.user.userId,
    );
  }

  @Get('/user')
  findUserPredictions(@Req() req) {
    this.predictionsService.findAllPredictionsByUserId(req.user.userId);
  }

  // @Get('/fixture/:id')
  // findAllByFixtureId(@Param('id') id: string) {
  //   this.predictionsService.findAllByFixtureId(+id);
  // }
}
