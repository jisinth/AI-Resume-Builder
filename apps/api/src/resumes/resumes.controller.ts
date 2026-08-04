import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';

@ApiTags('resumes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get('stats/dashboard')
  @ApiOperation({ summary: 'Get aggregate dashboard stats for the current user' })
  getDashboardStats(@CurrentUser() user: AuthenticatedUser) {
    return this.resumesService.getDashboardStats(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new resume' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateResumeDto) {
    return this.resumesService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all resumes owned by the current user' })
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.resumesService.list(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single resume by id' })
  get(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.resumesService.get(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a resume' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateResumeDto,
  ) {
    return this.resumesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a resume' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.resumesService.remove(user.id, id);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a resume' })
  duplicate(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.resumesService.duplicate(user.id, id);
  }
}
