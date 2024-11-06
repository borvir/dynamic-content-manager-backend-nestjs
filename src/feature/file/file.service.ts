import { Injectable } from '@nestjs/common';
import { FileCreateDto } from './dto/file-create.dto';
import { FileDto } from './dto/file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  public async createItem(
    dto: FileCreateDto,
    creatorId: string,
  ): Promise<FileDto> {
    const item = await FileCreateDto.toEntity(dto, creatorId);
    const entity = await this.repository.save(item);
    const ret = await this.repository.findOne({ where: { id: entity.id } });
    return FileDto.fromEntity(ret);
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
