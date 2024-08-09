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
import { Location } from './location.entity';

@Entity({ name: 'eating_schedules' })
export class EatingSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  class_id: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.eating_schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ type: 'timestamptz', nullable: false })
  start_time: Date;

  @Column({ type: 'timestamptz', nullable: false })
  end_time: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  meal: string;

  @Column({ type: 'text', nullable: false })
  menu: string;

  @Column({ nullable: false })
  location_id: number;

  @ManyToOne(() => Location, (location) => location.eating_schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  location: Location;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
