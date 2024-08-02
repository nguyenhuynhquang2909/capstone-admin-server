import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity({ name: 'user_tags' })
export class UserTag {
  @PrimaryColumn()
  comment_id: number;

  @PrimaryColumn()
  user_id: number;

  @ManyToOne(() => Comment, (comment) => comment.user_tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.user_tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
