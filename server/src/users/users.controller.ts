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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { USER_ROLE } from 'src/types';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOneById(req.user.userId);
  }

  @Get('rank')
  getRank(@Request() req) {
    return this.usersService.findUserRank(req.user.userId);
  }

  @Roles(USER_ROLE.ADMIN)
  @Get('premium')
  findAllPremiumUsers() {
    return this.usersService.findAllPremiumUsers();
  }

  @Put('premium')
  upgradeUserToPremium(@Request() req) {
    return this.usersService.upgradeUserToPremium(req.user.userId);
  }
}
