import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity({ name: 'toggle_likes' })
export class ToggleLike {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  post_id: number;

  @ManyToOne(() => User, (user) => user.toggle_likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.toggle_likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
