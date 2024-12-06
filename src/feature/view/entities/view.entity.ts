import { CoreEntity } from 'src/core/entity/core.entity';
import { Tag } from 'src/feature/tag/entities/tag.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class View extends CoreEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Tag, (tag) => tag.views, { lazy: true, cascade: true })
  @JoinTable()
  tags: Promise<Tag[]>;
}
