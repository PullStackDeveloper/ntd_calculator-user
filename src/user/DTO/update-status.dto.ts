import { IsIn, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  status: string;
}
