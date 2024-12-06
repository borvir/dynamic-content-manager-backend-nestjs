import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CoreDto } from 'src/core/dto/core.dto';
import { FileEntity } from '../entities/file.entity';
import { TagDto } from 'src/feature/tag/dto/tag.dto';

export class FileDto extends CoreDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  filename: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  fieldname: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  originalname: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  encoding: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  mimetype: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  destination: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  path: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  url: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  size: number;

  @IsArray()
  @ApiProperty({ required: true, example: 'Name' })
  tags: TagDto[];

  static async fromEntity(
    entity: FileEntity,
    withTags: boolean = false,
  ): Promise<FileDto> {
    const itemDto = new FileDto();
    await CoreDto.fromCoreEntity(entity, itemDto);

    itemDto.fieldname = entity.fieldname;
    itemDto.originalname = entity.originalname;
    itemDto.encoding = entity.encoding;
    itemDto.mimetype = entity.mimetype;
    itemDto.destination = entity.destination;
    itemDto.filename = entity.filename;
    itemDto.size = entity.size;
    itemDto.path = `http://localhost:3000/uploads/${entity.filename}`;

    if (withTags) {
      const tags = await entity.tags;
      if (tags) {
        const tagDtos = await Promise.all(
          tags.map((tag) => TagDto.fromEntity(tag)),
        );
        itemDto.tags = tagDtos.sort(
          (a, b) =>
            new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate(),
        );
      }
    }

    return itemDto;
  }
}
