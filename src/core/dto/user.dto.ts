import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../user/enitity/user.entity';

export class UserDto {
  @IsString()
  @ApiProperty({ required: true, example: 'borvir@gmail.com' })
  id: string;

  @IsString()
  @ApiProperty({ required: true, example: 'borvir@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ required: true, example: 'borvir' })
  username: string;

  static fromEntity(entity: User): any {
    if (!entity) return null;
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
    };
  }
}
