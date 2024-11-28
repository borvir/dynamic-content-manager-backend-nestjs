import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsUUID } from 'class-validator';
import { CoreEntity } from '../entity/core.entity';
import { UserLoginDto } from './user-login.dto';
import { UserDto } from './user.dto';

export class CoreDto {
  @ApiProperty({
    required: true,
    description: 'Die eindeutige ID der Datei im System.',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    required: false,
    description: 'Zeitpunkt der letzten Aktualisierung',
    example: '2020-10-04T06:47:28.420Z',
  })
  @IsDateString()
  changedAt: Date;

  @ApiProperty({
    required: false,
    description: 'Zeitpunkt der Erstellung',
    example: '2020-10-04T06:47:28.420Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    required: false,
    description: 'Zeitpunkt der Deaktivierung',
    example: '2020-10-04T06:47:28.420Z',
  })
  @IsDateString()
  deletedAt: Date;

  //   @ApiProperty({ required: false, description: 'letzter Änderer' })
  //   changedBy: CoreUserDto;

  @ApiProperty({ required: false, description: 'Ersteller' })
  createdBy: Promise<UserLoginDto>;

  static async fromCoreEntity(
    entity: CoreEntity,
    target?: CoreDto,
  ): Promise<CoreDto> {
    const dto = target || new CoreDto();
    dto.id = entity.id;
    dto.createdAt = entity.createdAt;
    dto.changedAt = entity.changedAt;

    if (entity.deletedAt) {
      dto.deletedAt = entity.deletedAt;
    }

    dto.createdBy = UserDto.fromEntity(await entity.createdBy);

    return dto;
  }
}
