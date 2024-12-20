import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../user/enitity/user.entity';

export class UserLoginDto {
  @IsString()
  @ApiProperty({ required: true, example: 'borvir@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ required: true, example: 'T1juanajail' })
  password: string;

  static fromEntity(entity: User): any {
    if (!entity) return null;
    return {
      email: entity.email,
    };
  }
}
