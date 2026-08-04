import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResumeTemplateSlug } from '@ai-resume-builder/types';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { PersonalInfoDto } from './personal-info.dto';
import { ExperienceDto } from './experience.dto';
import { EducationDto } from './education.dto';
import { ProjectDto } from './project.dto';
import { SkillDto } from './skill.dto';
import { AchievementDto } from './achievement.dto';
import { CertificateDto } from './certificate.dto';

export class CreateResumeDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({ enum: ResumeTemplateSlug })
  @IsOptional()
  @IsEnum(ResumeTemplateSlug)
  templateSlug?: ResumeTemplateSlug;

  @ApiProperty({ type: PersonalInfoDto })
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo!: PersonalInfoDto;

  @ApiPropertyOptional({ type: [ExperienceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience?: ExperienceDto[];

  @ApiPropertyOptional({ type: [EducationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education?: EducationDto[];

  @ApiPropertyOptional({ type: [ProjectDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  projects?: ProjectDto[];

  @ApiPropertyOptional({ type: [SkillDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills?: SkillDto[];

  @ApiPropertyOptional({ type: [AchievementDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AchievementDto)
  achievements?: AchievementDto[];

  @ApiPropertyOptional({ type: [CertificateDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificateDto)
  certificates?: CertificateDto[];
}
