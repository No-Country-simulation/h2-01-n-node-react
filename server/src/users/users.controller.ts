import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOneById(req.user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('rank')
  getRank(@Request() req) {
    return this.usersService.findUserRank(req.user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put('premium')
  upgradeUserToPremium(@Request() req) {
    return this.usersService.upgradeUserToPremium(req.user.userId);
  }
}
