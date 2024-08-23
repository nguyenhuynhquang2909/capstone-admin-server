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
import { Class } from './class.entity';
import { DailySchedule } from './daily-schedule.entity';
import { TeacherMedia } from './teacher-media.entity';

@Entity({ name: 'teachers' })
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ nullable: false })
  school_id: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact_number: string;

  @ManyToOne(() => School, (school) => school.teachers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'school_id' })
  school: School;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => Class, (classEntity) => classEntity.teacher)
  classes: Class[];

  @OneToMany(() => DailySchedule, (dailySchedule) => dailySchedule.teacher)
  daily_schedules: DailySchedule[];

  @OneToMany(() => TeacherMedia, (teacherMedia) => teacherMedia.teacher)
  teacher_media: TeacherMedia[];
}
