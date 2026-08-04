import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiProviderFactory } from './providers/ai-provider.factory';
import { ResumesModule } from '../resumes/resumes.module';

@Module({
  imports: [ResumesModule],
  controllers: [AiController],
  providers: [AiService, AiProviderFactory],
})
export class AiModule {}
