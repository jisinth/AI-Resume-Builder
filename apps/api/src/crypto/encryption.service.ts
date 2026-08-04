import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.validation';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

/**
 * Symmetric encryption for at-rest secrets (user-supplied AI provider API
 * keys). Not a substitute for a managed secrets store in a hosted
 * deployment, but keeps keys out of plaintext in the database.
 */
@Injectable()
export class EncryptionService {
  private readonly key: Buffer;

  constructor(configService: ConfigService<Env, true>) {
    const secret = configService.get('AI_SETTINGS_ENCRYPTION_KEY', { infer: true });
    this.key = createHash('sha256').update(secret).digest();
  }

  encrypt(plainText: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return [iv.toString('base64'), authTag.toString('base64'), ciphertext.toString('base64')].join(
      '.',
    );
  }

  decrypt(payload: string): string {
    const [ivPart, tagPart, dataPart] = payload.split('.');
    if (!ivPart || !tagPart || !dataPart) {
      throw new Error('Malformed encrypted payload');
    }
    const decipher = createDecipheriv(ALGORITHM, this.key, Buffer.from(ivPart, 'base64'));
    decipher.setAuthTag(Buffer.from(tagPart, 'base64'));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(dataPart, 'base64')),
      decipher.final(),
    ]);
    return plaintext.toString('utf8');
  }
}
