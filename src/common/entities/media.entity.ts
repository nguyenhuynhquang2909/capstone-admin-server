import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PostMedia } from './post-media.entity';
import { StudentMedia } from './student-media.entity';
import { School } from './school.entity';

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  url: string;

  @Column({ type: 'text', nullable: false })
  media_type: string;

  @Column({ nullable: false })
  school_id: number;

  @ManyToOne(() => School, (school) => school.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'school_id' })
  school: School;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => PostMedia, (postMedia) => postMedia.media)
  post_media: PostMedia[];

  @OneToMany(() => StudentMedia, (studentMedia) => studentMedia.media)
  student_media: StudentMedia[];
}
