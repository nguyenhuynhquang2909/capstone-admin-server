import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Class } from './class.entity';
import { Student } from './student.entity';

@Entity('class_students')
export class ClassStudent {
  @PrimaryColumn()
  class_id: number;

  @PrimaryColumn()
  student_id: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.classStudents)
  @JoinColumn({ name: 'class_id' })
  classEntity: Class;

  @ManyToOne(() => Student, (student) => student.classStudents)
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
