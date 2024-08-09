import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { School } from './school.entity';
import { User } from './user.entity';
import { PostMedia } from './post-media.entity';
import { PostHashtag } from './post-hashtag.entity';
import { Comment } from './comment.entity';
import { ToggleLike } from './toggle-like.entity';
import { PostClass } from './post-class.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ nullable: false })
  school_id: number;

  @ManyToOne(() => School, (school) => school.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column({ nullable: false })
  created_by: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  user: User;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  published_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => PostMedia, (postMedia) => postMedia.post, { cascade: true })
  post_media: PostMedia[];

  @OneToMany(() => PostHashtag, (postHashtag) => postHashtag.post, { cascade: true })
  post_hashtags: PostHashtag[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  @OneToMany(() => ToggleLike, (toggleLike) => toggleLike.post, { cascade: true })
  toggle_likes: ToggleLike[];

  @OneToMany(() => PostClass, (postClass) => postClass.post, { cascade: true })
  post_classes: PostClass[];
}
