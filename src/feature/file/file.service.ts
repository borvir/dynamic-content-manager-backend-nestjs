import { Injectable } from '@nestjs/common';
import { FileCreateDto } from './dto/file-create.dto';
import { FileDto } from './dto/file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { FileEntity } from '../file/entities/file.entity';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
    private configService: ConfigService,
  ) {}

  async findFileByHash(hash: string): Promise<FileEntity | null> {
    return await this.repository.findOne({ where: { hash } });
  }

  public async createItem(
    dto: FileCreateDto,
    creatorId: string,
  ): Promise<FileDto> {
    console.log(dto, creatorId);
    const item = await FileCreateDto.toEntity(dto, creatorId);
    const entity = await this.repository.save(item);
    const ret = await this.repository.findOne({
      where: { id: entity.id },
    });
    return FileDto.fromEntity(ret);
  }

  public async getOwnItems(
    includeDeleted: boolean,
    userId: string,
  ): Promise<FileDto[]> {
    const items = await this.repository.find({
      where: { createdBy: Equal(userId) },
      order: { changedAt: 'DESC' },
      cache: true,
      withDeleted: includeDeleted,
    });
    return Promise.all(
      items.map(async (x) => {
        return FileDto.fromEntity(x, true);
      }),
    );
  }

  async delete(fileId: string): Promise<any> {
    const file = await this.repository.findOneBy({ id: fileId });
    if (!file) {
      throw new Error('File not found');
    }

    const filePath = path.join(
      this.configService.get('UPLOAD_FOLDER'),
      file.path,
    );
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });

    return await this.repository.remove(file);
  }
}
