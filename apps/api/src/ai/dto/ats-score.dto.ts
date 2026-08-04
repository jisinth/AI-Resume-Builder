import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AtsScoreDto {
  @ApiProperty()
  @IsString()
  resumeId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(50, { message: 'Job description is too short to analyze' })
  jobDescription!: string;
}
