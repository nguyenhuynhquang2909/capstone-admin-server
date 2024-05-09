import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity('user_tags')
export class UserTag {
  @PrimaryColumn()
  comment_id: number;

  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  placeholder_number: number;

  @OneToOne(() => Comment, (comment) => comment.id)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
