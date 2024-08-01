import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @MinLength(5, {
    message: 'Username must be at least 5 characters long',
  })
  username: string;

  @IsString()
  password: string;
}
