import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreCreateDto } from 'src/core/dto/core-create.dto';
import { Tag } from '../entities/tag.entity';
import { User } from 'src/core/user/enitity/user.entity';

export class TagCreateDto extends CoreCreateDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  name: string;

  static async toEntity(dto: TagCreateDto, creatorId: string): Promise<Tag> {
    const entity = new Tag();

    await CoreCreateDto.createEntity(creatorId, entity);

    entity.name = dto.name;
    entity.user = Promise.resolve(new User(creatorId));
    return entity;
  }
}
