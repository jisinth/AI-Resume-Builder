import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CertificateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(160)
  issuer!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  issueDate?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  expiryDate?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  credentialUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  order?: number;
}
