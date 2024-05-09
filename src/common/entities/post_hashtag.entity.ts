import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { Hashtag } from './hashtag.entity';

@Entity('post_hashtags')
export class PostHashtag {
  @PrimaryColumn()
  postId: number;

  @PrimaryColumn()
  hashtagId: number;

  @PrimaryColumn()
  placeholderNumber: number;

  @ManyToOne(() => Post, (post) => post.hashtags)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Hashtag, (hashtag) => hashtag.posts)
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;
}
