import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Media } from './media.entity';

@Entity({ name: 'post_media' })
export class PostMedia {
  @PrimaryColumn()
  post_id: number;

  @PrimaryColumn()
  media_id: number;

  @ManyToOne(() => Post, (post) => post.post_media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Media, (media) => media.post_media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
