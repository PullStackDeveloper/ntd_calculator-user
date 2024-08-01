import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/DTO/create-user.dto';
import { LoginUserDto } from '../user/DTO/login-user.dto';
import { UserService } from '../user/user.service';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @Version('1')
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(
      createUserDto.username,
      createUserDto.password,
    );
  }

  @Post('login')
  @Version('1')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @Get('validate-token')
  @Version('1')
  async validateToken(@Req() req: ExpressRequest) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const token = authHeader.replace('Bearer ', '');
    return this.authService.validateToken(token);
  }
}
