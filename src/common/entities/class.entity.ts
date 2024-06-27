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
import { Teacher } from './teacher.entity';
import { School } from './school.entity';
import { DailySchedule } from './daily-schedule.entity';
import { EatingSchedule } from './eating-schedule.entity';
import { ClassStudent } from './class-student.entity';
import { Absence } from './absence.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ nullable: false })
  teacher_id: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.classes)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ nullable: false })
  school_id: number;

  @ManyToOne(() => School, (school) => school.classes)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @OneToMany(() => DailySchedule, (dailySchedule) => dailySchedule.classEntity)
  dailySchedules: DailySchedule[];

  @OneToMany(
    () => EatingSchedule,
    (eatingSchedule) => eatingSchedule.classEntity,
  )
  eatingSchedules: EatingSchedule[];

  @OneToMany(() => ClassStudent, (classStudent) => classStudent.classEntity)
  classStudents: ClassStudent[];

  @OneToMany(() => Absence, (absence) => absence.classEntity)
  absences: Absence[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
