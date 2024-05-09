import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('toggle_likes')
export class ToggleLike {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  post_id: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
