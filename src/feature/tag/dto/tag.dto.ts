import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CoreDto } from 'src/core/dto/core.dto';
import { Tag } from '../entities/tag.entity';
import { FileDto } from 'src/feature/file/dto/file.dto';

export class TagDto extends CoreDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  name: string;

  @IsArray()
  @ApiProperty({ required: true, example: 'Name' })
  files: FileDto[];

  static async fromEntity(entity: Tag): Promise<TagDto> {
    const itemDto = new TagDto();
    await CoreDto.fromCoreEntity(entity, itemDto);

    itemDto.name = entity.name;

    const files = await entity.files;
    if (files) {
      const fileDtos = await Promise.all(
        files.map((file) => FileDto.fromEntity(file)),
      );
      itemDto.files = fileDtos.sort(
        (a, b) =>
          new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate(),
      );
    }

    return itemDto;
  }
}
