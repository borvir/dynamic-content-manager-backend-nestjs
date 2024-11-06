import { CoreEntity } from 'src/core/entity/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Text extends CoreEntity {
  @Column({ unique: false })
  name: string;

  @Column({ unique: false })
  content: string;
}
