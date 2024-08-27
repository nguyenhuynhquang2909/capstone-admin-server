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
import { Teacher } from './teacher.entity';
import { DailySchedule } from './daily-schedule.entity';
import { EatingSchedule } from './eating-schedule.entity';
import { ClassStudent } from './class-student.entity';
import { PostClass } from './post-class.entity';
import { Request } from './request.entity';
import { Location } from './location.entity';

@Entity({ name: 'classes' })
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  school_year: string;

  @Column({ nullable: false })
  teacher_id: number;

  @Column({ nullable: false })
  school_id: number;

  @Column({ nullable: false })
  location_id: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.classes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToOne(() => Location, (location) => location.classes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'location_id'})
  location: Location;

  @ManyToOne(() => School, (school) => school.classes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'school_id' })
  school: School;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => DailySchedule, (dailySchedule) => dailySchedule.class)
  daily_schedules: DailySchedule[];

  @OneToMany(() => EatingSchedule, (eatingSchedule) => eatingSchedule.class)
  eating_schedules: EatingSchedule[];

  @OneToMany(() => ClassStudent, (classStudent) => classStudent.class)
  class_students: ClassStudent[];

  @OneToMany(() => PostClass, (postClass) => postClass.class)
  post_classes: PostClass[];

  @OneToMany(() => Request, (request) => request.class)
  requests: Request[];
}
