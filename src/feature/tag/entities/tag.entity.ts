import { CoreEntity } from 'src/core/entity/core.entity';
import { User } from 'src/core/user/enitity/user.entity';
import { FileEntity } from 'src/feature/file/entities/file.entity';
import { View } from 'src/feature/view/entities/view.entity';

import { Column, Entity, ManyToMany, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['name', 'user'])
export class Tag extends CoreEntity {
  @Column()
  name: string;

  @ManyToMany(() => FileEntity, (file) => file.tags, { lazy: true })
  files: Promise<FileEntity[]>;

  @ManyToMany(() => View, (view) => view.tags, { lazy: true })
  views: Promise<View[]>;

  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  user: Promise<User>;
}
