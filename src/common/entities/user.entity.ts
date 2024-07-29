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
import { Role } from './role.entity';
import { Post } from './post.entity';
import { Student } from './student.entity';
import { Comment } from './comment.entity';
import { ToggleLike } from './toggle-like.entity';
import { DeviceToken } from './device-token.entity';
import { UserSession } from './user-session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: false })
  role_id: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Student, (student) => student.user)
  students: Student[];

  @OneToMany(() => ToggleLike, (toggleLike) => toggleLike.user)
  likes: ToggleLike[];

  @OneToMany(() => DeviceToken, (deviceToken) => deviceToken.user)
  device_tokens: DeviceToken[];

  @OneToMany(() => UserSession, (userSession) => userSession.user)
  user_sessions: UserSession[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

// Hello