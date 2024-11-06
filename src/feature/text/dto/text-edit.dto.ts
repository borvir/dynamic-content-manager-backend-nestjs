import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CoreEditDto } from 'src/core/dto/core-edit.dto';
import { Text } from '../entities/text.entity';

export class TextEditDto extends CoreEditDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, example: 'Name' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, example: 'Name' })
  content?: string;

  static async toEntity(
    dto: TextEditDto,
    entity: Text,
    userId: string,
  ): Promise<Text> {
    await CoreEditDto.updateEntity(dto, entity, userId);

    if ('name' in dto) {
      entity.name = dto.name;
    }

    if ('content' in dto) {
      entity.content = dto.content;
    }

    return entity;
  }
}
