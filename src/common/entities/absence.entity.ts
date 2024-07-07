import { Entity, ManyToOne, PrimaryColumn, JoinColumn, Column } from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';
import { DailySchedule } from './daily-schedule.entity';

@Entity('absence')
export class Absence {
  @PrimaryColumn()
  student_id: number;

  @PrimaryColumn()
  class_id: number;


  @Column({length: 255, nullable: false})
  absence_status: string;

  @Column({length: 255, nullable: false})
  absence_type: string;

  @Column({type: 'timestamp', nullable: false})
  start_time: Date;

  @Column({type: 'timestamp', nullable: false})
  end_time: Date


  @Column({length: 255, nullable: false})
  reason: string;

  @ManyToOne(() => Student, (student) => student.absences)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Class, (classEntity) => classEntity.absences)
  @JoinColumn({ name: 'class_id' })
  classEntity: Class;


}
