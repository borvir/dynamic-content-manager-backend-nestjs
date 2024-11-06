import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CoreCreateDto } from 'src/core/dto/core-create.dto';
import { Tag } from '../entities/tag.entity';
import { FileEntity } from 'src/feature/file/entities/file.entity';

export class TagCreateDto extends CoreCreateDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  name: string;

  @IsString()
  @IsArray()
  @ApiProperty({ required: true, example: ['fileIds'] })
  fileIds?: string[];

  static async toEntity(dto: TagCreateDto, creatorId: string): Promise<Tag> {
    const entity = new Tag();

    await CoreCreateDto.createEntity(creatorId, entity);

    entity.name = dto.name;

    if ('fileIds' in dto) {
      entity.files = Promise.all(
        dto.fileIds.map((resId) => new FileEntity(resId)),
      );
    }

    return entity;
  }
}
