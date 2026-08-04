import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import type { Env } from '../config/env.validation';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: {
    user: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
  };
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed.jwt.token'),
      verifyAsync: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string) => {
        const values: Record<string, string> = {
          JWT_ACCESS_SECRET: 'access-secret',
          JWT_REFRESH_SECRET: 'refresh-secret',
          JWT_ACCESS_TTL: '15m',
          JWT_REFRESH_TTL: '7d',
        };
        return values[key];
      }),
    };

    authService = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as JwtService,
      configService as unknown as ConfigService<Env, true>,
    );
  });

  describe('register', () => {
    it('throws a conflict when the email is already taken', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing-user' });

      await expect(
        authService.register({
          name: 'Jane',
          email: 'jane@example.com',
          password: 'StrongPass123',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('creates a user with a hashed password and issues tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'jane@example.com',
        name: 'Jane',
      });
      prisma.user.update.mockResolvedValue({});

      const result = await authService.register({
        name: 'Jane',
        email: 'jane@example.com',
        password: 'StrongPass123',
      });

      expect(result.user).toEqual({ id: 'user-1', email: 'jane@example.com', name: 'Jane' });
      expect(result.tokens.accessToken).toBe('signed.jwt.token');
      const createArgs = prisma.user.create.mock.calls[0][0];
      expect(createArgs.data.passwordHash).not.toBe('StrongPass123');
    });
  });

  describe('login', () => {
    it('rejects an unknown email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'nobody@example.com', password: 'whatever' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects an incorrect password', async () => {
      const passwordHash = await bcrypt.hash('CorrectPass123', 4);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'jane@example.com',
        name: 'Jane',
        passwordHash,
      });

      await expect(
        authService.login({ email: 'jane@example.com', password: 'WrongPass123' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('issues tokens for a correct password', async () => {
      const passwordHash = await bcrypt.hash('CorrectPass123', 4);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'jane@example.com',
        name: 'Jane',
        passwordHash,
      });
      prisma.user.update.mockResolvedValue({});

      const result = await authService.login({
        email: 'jane@example.com',
        password: 'CorrectPass123',
      });

      expect(result.tokens.accessToken).toBe('signed.jwt.token');
    });
  });
});
