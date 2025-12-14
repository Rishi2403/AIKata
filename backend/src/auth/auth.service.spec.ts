import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

// Mock bcrypt module at the top level
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: '1',
        email: registerDto.email,
        password: hashedPassword,
        role: 'USER' as const,
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(createdUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email', registerDto.email);
      expect(result).not.toHaveProperty('password');
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = { email: 'existing@example.com', password: 'password123' };
      const existingUser = {
        id: '1',
        email: registerDto.email,
        password: 'hashedPassword',
        role: 'USER' as const,
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const user = {
        id: '1',
        email: loginDto.email,
        password: '$2b$10$hashedPassword',
        role: 'USER' as const,
        createdAt: new Date(),
      };
      const token = 'jwt-token-123';

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken', token);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, user.password);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto = { email: 'wrong@example.com', password: 'password123' };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      const user = {
        id: '1',
        email: loginDto.email,
        password: '$2b$10$hashedPassword',
        role: 'USER' as const,
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});