import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';
import { DailySchedule } from './daily-schedule.entity';

@Entity('absence')
export class Absence {
  @PrimaryColumn()
  student_id: number;

  @PrimaryColumn()
  class_id: number;

  @PrimaryColumn()
  daily_schedule_id: number;

  @ManyToOne(() => Student, (student) => student.absences)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Class, (classEntity) => classEntity.absences)
  @JoinColumn({ name: 'class_id' })
  classEntity: Class;

  @ManyToOne(() => DailySchedule, (dailySchedule) => dailySchedule.absences)
  @JoinColumn({ name: 'daily_schedule_id' })
  dailySchedule: DailySchedule;
}
