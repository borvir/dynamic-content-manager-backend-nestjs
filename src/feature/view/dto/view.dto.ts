import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CoreDto } from 'src/core/dto/core.dto';
import { View } from '../entities/view.entity';
import { TagDto } from 'src/feature/tag/dto/tag.dto';

export class ViewDto extends CoreDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  name: string;

  @IsArray()
  @ApiProperty({ required: true, example: 'Name' })
  tags: TagDto[];

  static async fromEntity(
    entity: View,
    withTags: boolean = false,
  ): Promise<ViewDto> {
    const itemDto = new ViewDto();
    await CoreDto.fromCoreEntity(entity, itemDto);

    itemDto.name = entity.name;

    if (withTags) {
      const tags = await entity.tags;
      if (tags) {
        const fileDtos = await Promise.all(
          tags.map((tag) => TagDto.fromEntity(tag)),
        );
        itemDto.tags = fileDtos.sort(
          (a, b) =>
            new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate(),
        );
      }
    }

    return itemDto;
  }
}
