import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { USER_ROLE } from 'src/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDTO } from './dtos/update.dto';

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

  @Put('profile')
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: 2 * 1024 * 1024 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update user profile with image upload. Max size: 2MB',
  })
  updateProfile(
    @Request() req,
    @UploadedFile() image: Express.Multer.File,
    @Body() _: UpdateUserDTO,
  ) {
    return this.usersService.update(req.user.userId, image);
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
