import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity('user_tags')
export class UserTag {
  @PrimaryColumn()
  commentId: number;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  placeholderNumber: number;

  @ManyToOne(() => Comment, (comment) => comment.userTags)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.userTags)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
