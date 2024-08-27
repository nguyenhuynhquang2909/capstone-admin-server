import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { School } from './school.entity';
import { DailySchedule } from './daily-schedule.entity';
import { EatingSchedule } from './eating-schedule.entity';
import { Class } from './class.entity';

@Entity({ name: 'locations' })
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  location_type: string;

  @Column({ type: 'integer' })
  floor: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', nullable: false })
  school_id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => School, (school) => school.locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'school_id' })
  school: School;

  @OneToMany(() => Class, (classEntity) => classEntity.location)
  classes: Class[];

  @OneToMany(() => DailySchedule, (dailySchedule) => dailySchedule.location)
  daily_schedules: DailySchedule[];

  @OneToMany(() => EatingSchedule, (eatingSchedule) => eatingSchedule.class)
  eating_schedules: EatingSchedule[];
}
