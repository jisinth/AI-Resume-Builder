import { ApiPropertyOptional } from '@nestjs/swagger';
import { AiProviderId } from '@ai-resume-builder/types';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAiSettingsDto {
  @ApiPropertyOptional({ enum: AiProviderId })
  @IsOptional()
  @IsEnum(AiProviderId)
  preferredProvider?: AiProviderId;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  openaiApiKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  anthropicApiKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  geminiApiKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  deepseekApiKey?: string;
}
