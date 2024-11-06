import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreDto } from 'src/core/dto/core.dto';
import { Text } from '../entities/text.entity';

export class TextDto extends CoreDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  name: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  content: string;

  static async fromEntity(entity: Text): Promise<TextDto> {
    const itemDto = new TextDto();
    await CoreDto.fromCoreEntity(entity, itemDto);

    itemDto.name = entity.name;
    itemDto.content = entity.content;

    return itemDto;
  }
}
