import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserChangePasswordDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  email: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  currentPassword: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  newPassword: string;
}
