import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  email: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  password: string;
}
