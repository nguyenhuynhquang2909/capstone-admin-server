import { Entity, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';

@Entity('absence')
export class Absence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

  @Column()
  class_id: number;

  @Column({ length: 255, nullable: false })
  absence_status: string;

  @Column({ length: 255, nullable: false })
  absence_type: string;

  @Column({ type: 'timestamp', nullable: false })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: false })
  end_time: Date;

  @Column({ length: 255, nullable: false })
  reason: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Student, (student) => student.absences)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Class, (classEntity) => classEntity.absences)
  @JoinColumn({ name: 'class_id' })
  classEntity: Class;
}
