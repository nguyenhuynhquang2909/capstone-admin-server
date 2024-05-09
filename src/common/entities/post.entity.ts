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
import { Image } from './image.entity';
import { Comment } from './comment.entity';
import { User } from './user.entity';
import { Hashtag } from './hashtag.entity';
import { ToggleLike } from './toggle_like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToOne(() => School, (school) => school.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'school_id' })
  school: School;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Image, (image) => image.post)
  @JoinColumn({ name: 'image_id' })
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.post)
  @JoinColumn({ name: 'comment_id' })
  comments: Comment[];

  @OneToMany(() => Hashtag, (hashtag) => hashtag.posts)
  @JoinColumn({ name: 'hashtag_id' })
  hashtags: Hashtag[];

  @OneToMany(() => ToggleLike, (toggleLike) => toggleLike.post)
  toggleLikes: ToggleLike[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
