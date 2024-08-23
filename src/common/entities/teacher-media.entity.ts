import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./teacher.entity";
import { Media } from "./media.entity";

@Entity({name: 'teacher_media'})
export class TeacherMedia{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    teacher_id: number;

    @Column({nullable: false})
    media_id: number;

    @ManyToOne(() => Teacher, (teacher) => teacher.teacher_media, {
        onDelete: 'CASCADE',
      })
      @JoinColumn({ name: 'teacher_id' })
      teacher: Teacher;

    @ManyToOne(() => Media, (media) => media.teacher_media, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'media_id'})
    media: Media;

    @CreateDateColumn({type: 'timestamptz'})
    created_at: Date;
}