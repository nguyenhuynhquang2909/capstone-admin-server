import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Class } from './class.entity';
import { Location } from './location.entity';
import { MealMedia } from './meal-media.entity'

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

  @Column({ type: 'varchar', array: true, nullable: false })
  menu: string[];

  @Column({ type: 'varchar', array: true, nullable: false })
  nutrition: string[];

  @Column({ nullable: false })
  location_id: number;

  @ManyToOne(() => Location, (location) => location.eating_schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @OneToMany(() => MealMedia, (mealMedia) => mealMedia.media)
  meal_media: MealMedia[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
