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
import { UserTag } from './user_tag.entity';
import { ToggleLike } from './toggle_like.entity';
import { SchoolAdmin } from './school_admin.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 20, unique: true, nullable: false })
  phone: string;

  @Column({ nullable: false })
  role_id: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Comment, (comment) => comment.user)
  @JoinColumn({ name: 'comment_id' })
  comments: Comment[];

  @OneToMany(() => Post, (post) => post.user)
  @JoinColumn({ name: 'post_id' })
  posts: Post[];

  @OneToMany(() => Student, (student) => student.user)
  @JoinColumn({ name: 'student_id' })
  students: Student[];

  @OneToMany(() => UserTag, (userTag) => userTag.user)
  userTags: UserTag[];

  @OneToMany(() => ToggleLike, (toggleLike) => toggleLike.user)
  toggleLikes: ToggleLike[];

  @OneToMany(() => SchoolAdmin, (schoolAdmin) => schoolAdmin.user)
  schoolAdmins: SchoolAdmin[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
