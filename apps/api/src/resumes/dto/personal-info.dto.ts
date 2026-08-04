import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class PersonalInfoDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  fullName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  headline?: string | null;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  linkedin?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  github?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  summary?: string | null;
}
