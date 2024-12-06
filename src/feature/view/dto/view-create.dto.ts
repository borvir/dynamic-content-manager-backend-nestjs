import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CoreCreateDto } from 'src/core/dto/core-create.dto';
import { View } from '../entities/view.entity';
import { Tag } from 'src/feature/tag/entities/tag.entity';

export class ViewCreateDto extends CoreCreateDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  name: string;

  @IsArray()
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  tagIds: string[];

  static async toEntity(dto: ViewCreateDto, creatorId: string): Promise<View> {
    const entity = new View();

    await CoreCreateDto.createEntity(creatorId, entity);

    entity.name = dto.name;
    if ('tagIds' in dto) {
      entity.tags = Promise.all(dto.tagIds.map((resId) => new Tag(resId)));
    }

    return entity;
  }
}
