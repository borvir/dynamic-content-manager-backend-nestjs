import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreDto } from 'src/core/dto/core.dto';
import { View } from '../entities/view.entity';

export class ViewDto extends CoreDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  name: string;

  static async fromEntity(entity: View): Promise<ViewDto> {
    const itemDto = new ViewDto();
    await CoreDto.fromCoreEntity(entity, itemDto);

    itemDto.name = entity.name;

    return itemDto;
  }
}
