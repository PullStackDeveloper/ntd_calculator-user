import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async create(username: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    try {
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {  // MySQL or PostgreSQL duplicate entry error codes
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async updateStatus(username: string, status: string): Promise<User> {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = status;
    return this.userRepository.save(user);
  }
}
