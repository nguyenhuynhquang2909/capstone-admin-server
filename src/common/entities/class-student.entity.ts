import { Entity, ManyToOne, PrimaryColumn, JoinColumn, Column } from 'typeorm';
import { Class } from './class.entity';
import { Student } from './student.entity';

@Entity({ name: 'class_students' })
export class ClassStudent {
  @PrimaryColumn()
  class_id: number;

  @PrimaryColumn()
  student_id: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.class_students, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Student, (student) => student.class_students, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'timestamptz', nullable: true })
  enrollment_date: Date;
}
