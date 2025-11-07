import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token on successful sign-in', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const token = 'test_token';

      mockUsersService.findOneByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(token);

      const result = await service.signIn(signInDto);

      expect(result).toEqual({ access_token: token });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(signInDto.password, user.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };
      mockUsersService.findOneByEmail.mockResolvedValue(
        new HttpException('User not found', 404),
      );

      const result = await service.signIn(signInDto);
      expect(result).toBeInstanceOf(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      mockUsersService.findOneByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.signIn(signInDto);
      expect(result).toBeInstanceOf(UnauthorizedException);
    });
  });
});
