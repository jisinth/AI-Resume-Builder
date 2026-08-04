import { Injectable } from '@nestjs/common';
import { AiProviderId } from '@ai-resume-builder/types';
import type { AiRewriteRequest } from '@ai-resume-builder/types';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../crypto/encryption.service';
import { ResumesService } from '../resumes/resumes.service';
import { resumeToPlainText } from '../resumes/resume.mapper';
import { AiProviderFactory, type ResolvedProviderKeys } from './providers/ai-provider.factory';

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly resumesService: ResumesService,
    private readonly providerFactory: AiProviderFactory,
  ) {}

  async rewrite(userId: string, request: AiRewriteRequest) {
    const provider = await this.resolveProvider(userId);
    return provider.rewrite(request);
  }

  async atsScore(userId: string, resumeId: string, jobDescription: string) {
    const resume = await this.resumesService.get(userId, resumeId);
    const provider = await this.resolveProvider(userId);
    const result = await provider.atsScore(resumeToPlainText(resume), jobDescription);
    await this.resumesService.updateAtsScore(resumeId, result.score.overall);
    return result;
  }

  async suggestions(userId: string, resumeId: string) {
    const resume = await this.resumesService.get(userId, resumeId);
    const provider = await this.resolveProvider(userId);
    return provider.suggestions(resumeToPlainText(resume));
  }

  private async resolveProvider(userId: string) {
    const settings = await this.prisma.userAiSettings.findUnique({ where: { userId } });
    const providerId = (settings?.preferredProvider as AiProviderId) ?? AiProviderId.MOCK;

    const keys: ResolvedProviderKeys = {
      openaiApiKey: this.tryDecrypt(settings?.openaiKeyCipher),
      anthropicApiKey: this.tryDecrypt(settings?.anthropicKeyCipher),
      geminiApiKey: this.tryDecrypt(settings?.geminiKeyCipher),
      deepseekApiKey: this.tryDecrypt(settings?.deepseekKeyCipher),
    };

    return this.providerFactory.create(providerId, keys);
  }

  private tryDecrypt(cipher: string | null | undefined): string | undefined {
    if (!cipher) return undefined;
    try {
      return this.encryption.decrypt(cipher);
    } catch {
      return undefined;
    }
  }
}
