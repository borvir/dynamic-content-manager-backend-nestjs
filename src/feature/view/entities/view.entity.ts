import { CoreEntity } from 'src/core/entity/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class View extends CoreEntity {
  @Column({ unique: true })
  name: string;
}
