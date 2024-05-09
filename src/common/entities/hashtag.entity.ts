import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('hashtags')
export class Hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  tag: string;

  @ManyToMany(() => Post, (post) => post.hashtags)
  @JoinColumn({ name: 'post_id' })
  posts: Post[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
