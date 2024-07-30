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
import { DeviceToken } from './device-token.entity';
import { UserSession } from './user-session.entity';
import { Post } from './post.entity';
import { Student } from './student.entity';
import { Comment } from './comment.entity';
import { SchoolAdmin } from './school-admin.entity';
import { Notification } from './notification.entity';
import { ToggleLike } from './toggle-like.entity';
import { UserTag } from './user-tag.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column()
  role_id: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => DeviceToken, (deviceToken) => deviceToken.user)
  device_tokens: DeviceToken[];

  @OneToMany(() => UserSession, (userSession) => userSession.user)
  user_sessions: UserSession[];

  @OneToMany(() => Post, (post) => post.created_by)
  posts: Post[];

  @OneToMany(() => Student, (student) => student.parent)
  students: Student[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => SchoolAdmin, (schoolAdmin) => schoolAdmin.user)
  school_admins: SchoolAdmin[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => ToggleLike, (toggleLike) => toggleLike.user)
  toggle_likes: ToggleLike[];

  @OneToMany(() => UserTag, (userTag) => userTag.user)
  user_tags: UserTag[];
}
