import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
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
