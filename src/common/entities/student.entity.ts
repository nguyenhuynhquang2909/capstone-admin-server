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
import { School } from './school.entity';
import { User } from './user.entity';
import { ClassStudent } from './class-student.entity';
import { Request } from './request.entity';
import { StudentMedia } from './student-media.entity';

@Entity({ name: 'students' })
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ nullable: false })
  school_id: number;

  @Column({ nullable: false })
  parent_id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  gender: string;

  @Column({ type: 'text', nullable: false })
  date_of_birth: string;

  @ManyToOne(() => School, (school) => school.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'school_id' })
  school: School;

  @ManyToOne(() => User, (user) => user.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => ClassStudent, (classStudent) => classStudent.student)
  class_students: ClassStudent[];

  @OneToMany(() => Request, (request) => request.student)
  requests: Request[];

  @OneToMany(() => StudentMedia, (studentMedia) => studentMedia.student)
  student_media: StudentMedia[];
}
