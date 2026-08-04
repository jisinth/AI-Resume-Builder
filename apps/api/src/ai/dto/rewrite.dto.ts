import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AiTaskType } from '@ai-resume-builder/types';
import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class RewriteDto {
  @ApiProperty({ enum: [AiTaskType.REWRITE_BULLET, AiTaskType.REWRITE_SUMMARY] })
  @IsIn([AiTaskType.REWRITE_BULLET, AiTaskType.REWRITE_SUMMARY])
  task!: AiTaskType.REWRITE_BULLET | AiTaskType.REWRITE_SUMMARY;

  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  text!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  context?: { jobTitle?: string; targetRole?: string };
}
