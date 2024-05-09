import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { SchoolAdmin } from './school_admin.entity';
import { Student } from './student.entity';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @OneToMany(() => Student, (student) => student.user)
  @JoinColumn({ name: 'student_id' })
  students: Student[];

  @OneToMany(() => SchoolAdmin, (schoolAdmin) => schoolAdmin.school)
  schoolAdmins: SchoolAdmin[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Post, (post) => post.school)
  @JoinColumn({ name: 'post_id' })
  posts: Post[];
}
