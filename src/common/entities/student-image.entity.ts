import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { MainImage } from './main-image.entity';

@Entity('student_images')
export class StudentImage {
  @PrimaryColumn()
  student_id: number;

  @PrimaryColumn()
  image_id: number;

  @ManyToOne(() => Student, (student) => student.id)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => MainImage, (mainImage) => mainImage.id)
  @JoinColumn({ name: 'image_id' })
  image: MainImage;
}
