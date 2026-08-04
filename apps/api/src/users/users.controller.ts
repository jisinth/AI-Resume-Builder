import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateAiSettingsDto } from './dto/update-ai-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user profile' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getProfile(user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the current user profile' })
  updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get('ai-settings')
  @ApiOperation({ summary: 'Get the current user AI provider preference and key status' })
  getAiSettings(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getAiSettings(user.id);
  }

  @Put('ai-settings')
  @ApiOperation({ summary: 'Configure preferred AI provider and bring-your-own-key API keys' })
  updateAiSettings(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateAiSettingsDto) {
    return this.usersService.updateAiSettings(user.id, dto);
  }
}
