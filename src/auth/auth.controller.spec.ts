import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/DTO/create-user.dto';
import { LoginUserDto } from '../user/DTO/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  validateUser: jest.fn(),
  login: jest.fn(),
  validateToken: jest.fn(),
};

const mockUserService = {
  create: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should register a new user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'password',
    };
    mockUserService.create.mockResolvedValue('some user data');

    const result = await authController.register(createUserDto);
    expect(result).toEqual('some user data');
  });

  it('should login a user with valid credentials', async () => {
    const loginUserDto: LoginUserDto = {
      username: 'testuser',
      password: 'password',
    };
    mockAuthService.validateUser.mockResolvedValue('some user data');
    mockAuthService.login.mockResolvedValue({ access_token: 'access_token' });

    const result = await authController.login(loginUserDto);
    expect(result).toEqual({ access_token: 'access_token' });
  });

  it('should return invalid credentials message for invalid login', async () => {
    const loginUserDto: LoginUserDto = {
      username: 'testuser',
      password: 'password',
    };
    mockAuthService.validateUser.mockResolvedValue(null);

    const result = await authController.login(loginUserDto);
    expect(result).toEqual({ message: 'Invalid credentials' });
  });

  it('should validate a token with valid authorization header', async () => {
    const req = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    } as any;
    mockAuthService.validateToken.mockResolvedValue('some user data');

    const result = await authController.validateToken(req);
    expect(result).toEqual('some user data');
  });

  it('should throw UnauthorizedException if authorization header is missing', async () => {
    const req = {
      headers: {},
    } as any;

    await expect(authController.validateToken(req)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid_token',
      },
    } as any;
    mockAuthService.validateToken.mockImplementation(() => {
      throw new UnauthorizedException('Invalid token');
    });

    await expect(authController.validateToken(req)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
