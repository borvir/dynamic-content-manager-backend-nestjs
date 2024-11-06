import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CoreEditDto } from 'src/core/dto/core-edit.dto';
import { Tag } from '../entities/tag.entity';

export class TagEditDto extends CoreEditDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, example: 'Name' })
  name?: string;

  static async toEntity(
    dto: TagEditDto,
    entity: Tag,
    userId: string,
  ): Promise<Tag> {
    await CoreEditDto.updateEntity(dto, entity, userId);

    if ('name' in dto) {
      entity.name = dto.name;
    }

    return entity;
  }
}
