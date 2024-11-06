import { CoreEntity } from 'src/core/entity/core.entity';
import { Tag } from 'src/feature/tag/entities/tag.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class FileEntity extends CoreEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: false })
  fieldname: string;

  @Column({ unique: false })
  originalname: string;

  @Column({ unique: false })
  encoding: string;

  @Column({ unique: false })
  mimetype: string;

  @Column({ unique: false })
  destination: string;

  @Column({ unique: true })
  filename: string;

  @Column({ unique: false })
  path: string;

  @Column({ unique: false })
  size: number;

  @ManyToMany(() => Tag, (tag) => tag.files)
  @JoinTable()
  tags: Tag[];
}
