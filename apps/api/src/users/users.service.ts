import { Injectable, NotFoundException } from '@nestjs/common';
import { AiProviderId } from '@ai-resume-builder/types';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../crypto/encryption.service';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import type { UpdateAiSettingsDto } from './dto/update-ai-settings.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _passwordHash, refreshToken: _refreshToken, ...safe } = user;
    return safe;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({ where: { id: userId }, data: dto });
    const { passwordHash: _passwordHash, refreshToken: _refreshToken, ...safe } = user;
    return safe;
  }

  async getAiSettings(userId: string) {
    const settings = await this.prisma.userAiSettings.findUnique({ where: { userId } });
    return {
      preferredProvider: settings?.preferredProvider ?? AiProviderId.MOCK,
      hasOpenaiKey: Boolean(settings?.openaiKeyCipher),
      hasAnthropicKey: Boolean(settings?.anthropicKeyCipher),
      hasGeminiKey: Boolean(settings?.geminiKeyCipher),
      hasDeepseekKey: Boolean(settings?.deepseekKeyCipher),
    };
  }

  async updateAiSettings(userId: string, dto: UpdateAiSettingsDto) {
    const data: Record<string, unknown> = {};
    if (dto.preferredProvider) data.preferredProvider = dto.preferredProvider;
    if (dto.openaiApiKey) data.openaiKeyCipher = this.encryption.encrypt(dto.openaiApiKey);
    if (dto.anthropicApiKey) data.anthropicKeyCipher = this.encryption.encrypt(dto.anthropicApiKey);
    if (dto.geminiApiKey) data.geminiKeyCipher = this.encryption.encrypt(dto.geminiApiKey);
    if (dto.deepseekApiKey) data.deepseekKeyCipher = this.encryption.encrypt(dto.deepseekApiKey);

    await this.prisma.userAiSettings.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });

    return this.getAiSettings(userId);
  }
}
