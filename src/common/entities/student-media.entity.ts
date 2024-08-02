import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Media } from './media.entity';

@Entity({ name: 'student_media' })
export class StudentMedia {
  @PrimaryColumn()
  student_id: number;

  @PrimaryColumn()
  media_id: number;

  @ManyToOne(() => Student, (student) => student.student_media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Media, (media) => media.student_media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
