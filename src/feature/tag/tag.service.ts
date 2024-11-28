import { Injectable, NotFoundException } from '@nestjs/common';
import { TagCreateDto } from './dto/tag-create.dto';
import { TagEditDto } from './dto/tag-edit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { TagDto } from './dto/tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private repository: Repository<Tag>,
  ) {}

  public async getItems(includeDeleted: boolean): Promise<TagDto[]> {
    const items = await this.repository.find({
      order: { changedAt: 'DESC' },
      cache: true,
      withDeleted: includeDeleted,
      // relations: ["changedBy", "createdBy"]
    });
    return Promise.all(
      items.map(async (x) => {
        return TagDto.fromEntity(x);
      }),
    );
  }

  public async getOwnItems(
    includeDeleted: boolean,
    userId: string,
  ): Promise<TagDto[]> {
    const items = await this.repository.find({
      where: { createdBy: Equal(userId) },
      order: { changedAt: 'DESC' },
      cache: true,
      withDeleted: includeDeleted,
      // relations: ['changedBy', 'createdBy'],
    });
    return Promise.all(
      items.map(async (x) => {
        return TagDto.fromEntity(x, false);
      }),
    );
  }

  public async getItem(id: string): Promise<TagDto> {
    const item = await this.repository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!item) throw new NotFoundException();

    return TagDto.fromEntity(item);
  }

  public async createItem(
    dto: TagCreateDto,
    creatorId?: string,
  ): Promise<TagDto> {
    const item = await TagCreateDto.toEntity(dto, creatorId);
    const entity = await this.repository.save(item);
    const ret = await this.repository.findOne({ where: { id: entity.id } });
    return TagDto.fromEntity(ret);
  }

  public async updateItem(
    dto: TagEditDto,
    itemId: string,
    creatorId: string,
  ): Promise<TagDto> {
    let item = await this.repository.findOne({
      where: { id: itemId },
      withDeleted: true,
    });
    item = await TagEditDto.toEntity(dto, item, creatorId);
    const entity = await this.repository.save(item);
    const ret = await this.repository.findOne({ where: { id: entity.id } });
    return TagDto.fromEntity(ret);
  }

  public async tryDeleteOrSetInactive(id: string): Promise<number> {
    const entity = await this.repository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!entity) {
      throw new NotFoundException(`Tag "${id}" not found`);
    }
    try {
      await this.repository.remove(entity);
      // if (!deleteResult.affected) {
      //     throw new NotFoundException(`Tag "${id}" not found`);
      // }
      return 200;
    } catch (error) {
      const r = await this.repository.softDelete(id);
      if (r.affected > 0) {
        return 226;
      } else {
        return 404;
      }
    }
    // const canDelete = await this.validator.canDelete(id);
    // if (canDelete) {
    // } else {
    //     const r = await this.repository.softDelete(id);
    //     if (r.affected > 0) {
    //         return 226;
    //     }
    // }
  }
}
