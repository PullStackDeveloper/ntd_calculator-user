import { Body, Controller, Get, Param, Patch, Version } from "@nestjs/common";
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateStatusDto } from './DTO/update-status.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':username')
  @Version('1')
  async getUser(
    @Param('username') username: string,
  ): Promise<User | undefined> {
    return this.userService.findOne(username);
  }

  @Patch(':username/status')
  @Version('1')
  async updateStatus(
    @Param('username') username: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<User> {
    return this.userService.updateStatus(username, updateStatusDto.status);
  }
}
