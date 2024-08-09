import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { Teacher } from './teacher.entity';
import { Subject } from './subject.entity';
import { Location } from './location.entity';

@Entity({ name: 'daily_schedules' })
export class DailySchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  class_id: number;

  @Column({ nullable: false })
  teacher_id: number;

  @Column({ nullable: false })
  subject_id: number;

  @Column({ nullable: false })
  location_id: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.daily_schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Location, (location) => location.daily_schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  location: Location;

  @Column({ type: 'timestamptz', nullable: false })
  start_time: Date;

  @Column({ type: 'timestamptz', nullable: false })
  end_time: Date;

  @ManyToOne(() => Teacher, (teacher) => teacher.daily_schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToOne(() => Subject, (subject) => subject.daily_schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
