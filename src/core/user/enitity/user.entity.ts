import { Tag } from 'src/feature/tag/entities/tag.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  WATCHER = 'Watcher',
  OWNER = 'Owner',
}

@Entity()
export class User {
  constructor(id?: string) {
    if (id !== undefined) {
      this.id = id;
    }
  }

  @Column({ nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: Role.OWNER })
  role: Role;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  changedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ default: false })
  isConfirmed: boolean;

  tags: Promise<Tag[]>;
}
