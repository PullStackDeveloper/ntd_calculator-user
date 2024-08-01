import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

const mockUserService = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should validate a user with correct credentials', async () => {
    const user = new User();
    user.username = 'testuser';
    user.password = await bcrypt.hash('password', 10);
    mockUserService.findOne.mockResolvedValue(user);

    const result = await authService.validateUser('testuser', 'password');
    expect(result).toEqual(user);
  });

  it('should return null if credentials are incorrect', async () => {
    const user = new User();
    user.username = 'testuser';
    user.password = await bcrypt.hash('wrongpassword', 10);
    mockUserService.findOne.mockResolvedValue(user);

    const result = await authService.validateUser('testuser', 'password');
    expect(result).toBeNull();
  });

  it('should return an access token on login', async () => {
    const user = new User();
    user.username = 'testuser';
    user.id = 1;
    mockJwtService.sign.mockReturnValue('access_token');

    const result = await authService.login(user);
    expect(result).toEqual({ access_token: 'access_token' });
  });

  it('should validate a valid token', async () => {
    const user = new User();
    user.username = 'testuser';
    mockJwtService.verify.mockReturnValue({ username: 'testuser' });
    mockUserService.findOne.mockResolvedValue(user);

    const result = await authService.validateToken('valid_token');
    expect(result).toEqual(user);
  });

  it('should throw an error for an invalid token', async () => {
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(authService.validateToken('invalid_token')).rejects.toThrow(
      'Invalid token',
    );
  });
});
