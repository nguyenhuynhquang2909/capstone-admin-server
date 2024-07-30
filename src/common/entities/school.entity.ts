import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Class } from './class.entity';
import { Student } from './student.entity';
import { Teacher } from './teacher.entity';
import { Post } from './post.entity';
import { SchoolAdmin } from './school-admin.entity';

@Entity({ name: 'schools' })
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => Class, (classEntity) => classEntity.school)
  classes: Class[];

  @OneToMany(() => Student, (student) => student.school)
  students: Student[];

  @OneToMany(() => Teacher, (teacher) => teacher.school)
  teachers: Teacher[];

  @OneToMany(() => Post, (post) => post.school)
  posts: Post[];

  @OneToMany(() => SchoolAdmin, (schoolAdmin) => schoolAdmin.school)
  school_admins: SchoolAdmin[];
}
