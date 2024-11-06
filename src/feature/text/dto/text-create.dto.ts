import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreCreateDto } from 'src/core/dto/core-create.dto';
import { Text } from '../entities/text.entity';

export class TextCreateDto extends CoreCreateDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  name: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  content: string;

  static async toEntity(dto: TextCreateDto, creatorId: string): Promise<Text> {
    const entity = new Text();

    await CoreCreateDto.createEntity(creatorId, entity);

    entity.name = dto.name;
    entity.content = dto.content;

    return entity;
  }
}
