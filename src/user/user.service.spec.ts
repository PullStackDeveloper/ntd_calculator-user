import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = new User();
      user.username = 'testuser';
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findOne('testuser');
      expect(result).toEqual(user);
    });

    it('should return undefined if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      const result = await userService.findOne('testuser');
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const user = new User();
      user.username = 'testuser';
      user.password = 'hashedpassword';
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      const result = await userService.create('testuser', 'password');
      expect(result).toEqual(user);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'hashedpassword',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw ConflictException if username already exists', async () => {
      mockUserRepository.save.mockRejectedValue({ code: '23505' }); // PostgreSQL duplicate error code

      await expect(userService.create('testuser', 'password')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update user status if user is found', async () => {
      const user = new User();
      user.username = 'testuser';
      user.status = 'active';
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await userService.updateStatus('testuser', 'inactive');
      expect(result.status).toBe('inactive');
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      await expect(
        userService.updateStatus('testuser', 'inactive'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
