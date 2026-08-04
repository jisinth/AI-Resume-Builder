import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AiService } from './ai.service';
import { RewriteDto } from './dto/rewrite.dto';
import { AtsScoreDto } from './dto/ats-score.dto';
import { SuggestionsDto } from './dto/suggestions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 20, ttl: 60_000 } })
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('rewrite')
  @ApiOperation({ summary: 'Rewrite a resume bullet or summary with AI' })
  rewrite(@CurrentUser() user: AuthenticatedUser, @Body() dto: RewriteDto) {
    return this.aiService.rewrite(user.id, dto);
  }

  @Post('ats-score')
  @ApiOperation({ summary: 'Score a resume against a job description' })
  atsScore(@CurrentUser() user: AuthenticatedUser, @Body() dto: AtsScoreDto) {
    return this.aiService.atsScore(user.id, dto.resumeId, dto.jobDescription);
  }

  @Post('suggestions')
  @ApiOperation({ summary: 'Get AI suggestions to improve a resume' })
  suggestions(@CurrentUser() user: AuthenticatedUser, @Body() dto: SuggestionsDto) {
    return this.aiService.suggestions(user.id, dto.resumeId);
  }
}
