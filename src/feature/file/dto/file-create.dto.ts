import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CoreCreateDto } from 'src/core/dto/core-create.dto';
import { FileEntity } from '../entities/file.entity';

export class FileCreateDto extends CoreCreateDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  file: Express.Multer.File;

  @IsString()
  @IsArray()
  tagIds: string[];

  static async toEntity(
    dto: FileCreateDto,
    creatorId: string,
  ): Promise<FileEntity> {
    const entity = new FileEntity();

    await CoreCreateDto.createEntity(creatorId, entity);

    entity.name = dto.file.filename;
    entity.fieldname = dto.file.fieldname;
    entity.originalname = dto.file.originalname;
    entity.encoding = dto.file.encoding;
    entity.mimetype = dto.file.mimetype;
    entity.destination = dto.file.destination;
    entity.filename = dto.file.filename;
    entity.path = dto.file.path;
    entity.size = dto.file.size;

    return entity;
  }
}
