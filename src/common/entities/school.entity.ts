import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Class } from './class.entity';
import { Student } from './student.entity';
import { Teacher } from './teacher.entity';
import { Post } from './post.entity';
import { Media } from './media.entity';
import { SchoolAdmin } from './school-admin.entity';
import { Location } from './location.entity';
import { Notification } from './notification.entity';

@Entity({ name: 'schools' })
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  contact_number: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => Class, (classEntity) => classEntity.school)
  classes: Class[];

  @OneToMany(() => Location, (location) => location.school)
  locations: Location[];

  @OneToMany(() => Student, (student) => student.school)
  students: Student[];

  @OneToMany(() => Teacher, (teacher) => teacher.school)
  teachers: Teacher[];

  @OneToMany(() => Post, (post) => post.school)
  posts: Post[];

  @OneToMany(() => Media, (media) => media.school)
  media: Media[];

  @OneToMany(() => SchoolAdmin, (schoolAdmin) => schoolAdmin.school)
  school_admins: SchoolAdmin[];

  @OneToMany(() => Notification, (notification) => notification.school)
  notifications: Notification[];
}
