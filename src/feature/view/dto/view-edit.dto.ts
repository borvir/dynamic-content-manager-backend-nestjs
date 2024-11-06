import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CoreEditDto } from 'src/core/dto/core-edit.dto';
import { View } from '../entities/view.entity';

export class ViewEditDto extends CoreEditDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, example: 'Name' })
  name?: string;

  static async toEntity(
    dto: ViewEditDto,
    entity: View,
    userId: string,
  ): Promise<View> {
    await CoreEditDto.updateEntity(dto, entity, userId);

    if ('name' in dto) {
      entity.name = dto.name;
    }

    return entity;
  }
}
