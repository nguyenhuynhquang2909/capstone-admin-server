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
import { Class } from './class.entity';
import { Absence } from './absence.entity';

@Entity('daily_schedules')
export class DailySchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  class_id: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.dailySchedules)
  @JoinColumn({ name: 'class_id' })
  classEntity: Class;

  @Column({ type: 'timestamptz', nullable: false })
  schedule_time: Date;

  @OneToMany(() => Absence, (absence) => absence.dailySchedule)
  absences: Absence[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
