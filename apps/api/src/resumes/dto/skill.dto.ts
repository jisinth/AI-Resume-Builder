import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ProficiencyLevel } from '@ai-resume-builder/types';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class SkillDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  category?: string | null;

  @ApiPropertyOptional({ enum: ProficiencyLevel })
  @IsOptional()
  @IsEnum(ProficiencyLevel)
  level?: ProficiencyLevel | null;

  @ApiPropertyOptional()
  @IsOptional()
  order?: number;
}
