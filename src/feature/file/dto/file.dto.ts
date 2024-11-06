import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreDto } from 'src/core/dto/core.dto';
import { FileEntity } from '../entities/file.entity';

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
  size: number;

  static async fromEntity(entity: FileEntity): Promise<FileDto> {
    const itemDto = new FileDto();
    await CoreDto.fromCoreEntity(entity, itemDto);

    itemDto.fieldname = entity.fieldname;
    itemDto.originalname = entity.originalname;
    itemDto.encoding = entity.encoding;
    itemDto.mimetype = entity.mimetype;
    itemDto.destination = entity.destination;
    itemDto.filename = entity.filename;
    itemDto.path = entity.path;
    itemDto.size = entity.size;

    return itemDto;
  }
}
