import {
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/enitity/user.entity';

export class CoreEntity {
  constructor(id?: string) {
    if (id !== undefined) {
      this.id = id;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { lazy: true, nullable: true })
  createdBy: Promise<User>;

  @UpdateDateColumn()
  changedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, { lazy: true, nullable: true })
  changedBy: Promise<User>;
}
