import { Entity, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm';
import { Post } from './post.entity';
import { Hashtag } from './hashtag.entity';

@Entity('posts_hashtags')
export class PostHashtag {
  @PrimaryColumn()
  post_id: number;

  @OneToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @PrimaryColumn()
  hash_tag_id: number;

  @OneToOne(() => Hashtag, (hashtag) => hashtag.id)
  @JoinColumn({ name: 'hash_tag_id' })
  hashtag: Hashtag;

  @PrimaryColumn()
  placeholderNumber: number;
}
