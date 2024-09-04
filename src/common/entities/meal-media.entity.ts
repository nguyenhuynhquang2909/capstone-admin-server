import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EatingSchedule } from './eating-schedule.entity';
import { Media } from './media.entity';

@Entity({ name: 'meal_media' })
export class MealMedia {

  @PrimaryColumn()
  meal_id: number;

  @PrimaryColumn()
  media_id: number;

  @ManyToOne(() => EatingSchedule, (meal) => meal.meal_media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meal_id' })
  meal: EatingSchedule;

  @ManyToOne(() => Media, (media) => media.meal_media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
