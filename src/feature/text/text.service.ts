import { Injectable, NotFoundException } from '@nestjs/common';
import { TextCreateDto } from './dto/text-create.dto';
import { TextEditDto } from './dto/text-edit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextDto } from './dto/text.dto';
import { Text } from './entities/text.entity';

@Injectable()
export class TextService {
  constructor(
    @InjectRepository(Text)
    private repository: Repository<Text>,
  ) {}

  public async getItems(includeDeleted: boolean): Promise<TextDto[]> {
    const items = await this.repository.find({
      order: { changedAt: 'DESC' },
      cache: true,
      withDeleted: includeDeleted,
    });
    return Promise.all(
      items.map(async (x) => {
        return TextDto.fromEntity(x);
      }),
    );
  }

  public async getItem(id: string): Promise<TextDto> {
    const item = await this.repository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!item) throw new NotFoundException();

    return TextDto.fromEntity(item);
  }

  public async createItem(
    dto: TextCreateDto,
    creatorId: string,
  ): Promise<TextDto> {
    const item = await TextCreateDto.toEntity(dto, creatorId);
    const entity = await this.repository.save(item);
    const ret = await this.repository.findOne({ where: { id: entity.id } });
    return TextDto.fromEntity(ret);
  }

  public async updateItem(
    dto: TextEditDto,
    itemId: string,
    creatorId: string,
  ): Promise<TextDto> {
    let item = await this.repository.findOne({
      where: { id: itemId },
      withDeleted: true,
    });
    item = await TextEditDto.toEntity(dto, item, creatorId);
    const entity = await this.repository.save(item);
    const ret = await this.repository.findOne({ where: { id: entity.id } });
    return TextDto.fromEntity(ret);
  }

  public async tryDeleteOrSetInactive(id: string): Promise<number> {
    const entity = await this.repository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!entity) {
      throw new NotFoundException(`Text "${id}" not found`);
    }
    try {
      await this.repository.remove(entity);
      return 200;
    } catch (error) {
      const r = await this.repository.softDelete(id);
      if (r.affected > 0) {
        return 226;
      } else {
        return 404;
      }
    }
  }
}
