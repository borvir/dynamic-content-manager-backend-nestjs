import { Injectable, NotFoundException } from '@nestjs/common';
import { ViewCreateDto } from './dto/view-create.dto';
import { ViewEditDto } from './dto/view-edit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewDto } from './dto/view.dto';
import { View } from './entities/view.entity';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(View)
    private repository: Repository<View>,
  ) {}

  public async getItems(includeDeleted: boolean): Promise<ViewDto[]> {
    const items = await this.repository.find({
      order: { changedAt: 'DESC' },
      cache: true,
      withDeleted: includeDeleted,
      // relations: ["changedBy", "createdBy"]
    });
    return Promise.all(
      items.map(async (x) => {
        return ViewDto.fromEntity(x);
      }),
    );
  }

  public async getItem(id: string): Promise<ViewDto> {
    const item = await this.repository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!item) throw new NotFoundException();

    return ViewDto.fromEntity(item);
  }

  public async createItem(
    dto: ViewCreateDto,
    creatorId: string,
  ): Promise<ViewDto> {
    const item = await ViewCreateDto.toEntity(dto, creatorId);
    const entity = await this.repository.save(item);
    const ret = await this.repository.findOne({ where: { id: entity.id } });
    return ViewDto.fromEntity(ret);
  }

  public async updateItem(
    dto: ViewEditDto,
    itemId: string,
    creatorId: string,
  ): Promise<ViewDto> {
    let item = await this.repository.findOne({
      where: { id: itemId },
      withDeleted: true,
    });
    item = await ViewEditDto.toEntity(dto, item, creatorId);
    const entity = await this.repository.save(item);
    const ret = await this.repository.findOne({ where: { id: entity.id } });
    return ViewDto.fromEntity(ret);
  }

  public async tryDeleteOrSetInactive(id: string): Promise<number> {
    const entity = await this.repository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!entity) {
      throw new NotFoundException(`View "${id}" not found`);
    }
    try {
      await this.repository.remove(entity);
      // if (!deleteResult.affected) {
      //     throw new NotFoundException(`View "${id}" not found`);
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
