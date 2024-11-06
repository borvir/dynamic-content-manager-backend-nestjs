import { CoreEntity } from 'src/core/entity/core.entity';
import { FileEntity } from 'src/feature/file/entities/file.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Tag extends CoreEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => FileEntity, (file) => file.tags)
  files: Promise<FileEntity[]>;
}
