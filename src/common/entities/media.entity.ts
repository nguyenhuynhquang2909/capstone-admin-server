import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PostMedia } from './post-media.entity';
import { StudentMedia } from './student-media.entity';

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  url: string;

  @Column({ type: 'text', nullable: false })
  media_type: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => PostMedia, (postMedia) => postMedia.media)
  post_media: PostMedia[];

  @OneToMany(() => StudentMedia, (studentMedia) => studentMedia.media)
  student_media: StudentMedia[];
}
