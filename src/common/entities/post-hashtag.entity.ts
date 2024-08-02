import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { Hashtag } from './hashtag.entity';

@Entity({ name: 'posts_hashtags' })
export class PostHashtag {
  @PrimaryColumn()
  post_id: number;

  @PrimaryColumn()
  hashtag_id: number;

  @ManyToOne(() => Post, (post) => post.post_hashtags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Hashtag, (hashtag) => hashtag.posts_hashtags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;
}
