import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreCreateDto } from 'src/core/dto/core-create.dto';
import { View } from '../entities/view.entity';

export class ViewCreateDto extends CoreCreateDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Name' })
  name: string;

  static async toEntity(dto: ViewCreateDto, creatorId: string): Promise<View> {
    const entity = new View();

    await CoreCreateDto.createEntity(creatorId, entity);

    entity.name = dto.name;

    return entity;
  }
}
