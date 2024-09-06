import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Teacher } from 'src/common/entities/teacher.entity';
import { Repository } from 'typeorm';
import { TeacherProfileDto } from './dto/teacher-profile.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { create } from 'domain';
import { Media } from 'src/common/entities/media.entity';
import { MediaService } from '../media/media.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
    private readonly defaultProfilePictureUrl = 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg';
    constructor(
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
        @InjectRepository(SchoolAdmin)
        private readonly schoolAdminRepository: Repository<SchoolAdmin>,
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>,
        private readonly mediaService: MediaService
    ) {}

    async getSchoolIdForUser(userId: number): Promise<number> {
        const schoolAdmin = await this.schoolAdminRepository.findOne({
            where: {user_id: userId}
        });
        if (!schoolAdmin) {
            throw new NotFoundException('School not found for this user');
        }
        return schoolAdmin.school_id;
    }

    async getAllTeachers(userId: number): Promise<Teacher[]> {
        const schoolId = await this.getSchoolIdForUser(userId);
        return await this.teacherRepository.find({
            where: {school_id: schoolId }
        });
    }

    async getTeacherProfile(teacherId: number): Promise<TeacherProfileDto> {
        const teacher = await this.teacherRepository.findOne({
            where: {id: teacherId},
            relations: ['school', 'classes', 'classes.location','teacher_media', 'teacher_media.media']
        })

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        let profilePictureUrl = 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg';
        if (teacher.teacher_media && teacher.teacher_media.length > 0) {
            profilePictureUrl = teacher.teacher_media[0].media.url;
        }
        const classes = teacher.classes.map((classEntity) => ({
            id: classEntity.id,
            name: classEntity.name,
            location_id: classEntity.location_id,
            location_name: classEntity.location.name,
            school_year: classEntity.school_year,
        }));

        const teacherProfile: TeacherProfileDto = {
            id: teacher.id,
            name: teacher.name,
            contact_number: teacher.contact_number,
            school_name: teacher.school.name,
            classes: classes,
            profilePictureUrl: profilePictureUrl
        };
        return teacherProfile;
    }

    async createTeacher(createTeacherDto: CreateTeacherDto, userId: number): Promise<Teacher> {
        const {name, contact_number} = createTeacherDto;
        const school_id = await this.getSchoolIdForUser(userId);

        const newTeacher = this.teacherRepository.create({
            name,
            contact_number,
            school_id,

        });
        return await this.teacherRepository.save(newTeacher);
    }

    async updateTeacher(teacherId: number,updateTeacherDto: UpdateTeacherDto, files: Express.Multer.File[], userId: number): Promise<Teacher> {
        const teacherResult = await this.teacherRepository.query(
            `
            SELECT * FROM teachers WHERE id = $1
            `,
            [teacherId]
        );
        if (teacherResult.length === 0) {
            throw new NotFoundException('Teacher not found');
        }

        const teacher = teacherResult[0];

        if (updateTeacherDto.name) {
            teacher.name = updateTeacherDto.name;
            await this.teacherRepository.query(
                `UPDATE teachers SET name = $1 WHERE id = $2`,
                [teacher.name, teacherId]
            );
        }

        if (updateTeacherDto.contact_number) {
            teacher.contact_number = updateTeacherDto.contact_number;
            await this.teacherRepository.query(
                `UPDATE teachers SET contact_number = $1 WHERE id = $2`,
                [teacher.contact_number, teacherId]
            );
        }

        if (files && files.length > 0) {
            const teacherMediaResult = await this.teacherRepository.query(
                `
                SELECT m.id AS media_id 
                FROM teacher_media tm
                JOIN media m ON tm.media_id = m.id
                WHERE tm.teacher_id = $1
                `,
                [teacherId]
            );

            if (teacherMediaResult.length > 0) {
                const oldMediaId = teacherMediaResult[0].media_id;
                await this.mediaService.deleteMedia(oldMediaId);
            }

            const media = await this.mediaService.uploadMedia(files, userId);
            for (const mediaItem of media) {
                await this.teacherRepository.query(
                    'INSERT INTO teacher_media (teacher_id, media_id) VALUES ($1, $2)',
                    [teacherId, mediaItem.id]
                );
            }
        }
        return await this.teacherRepository.save(teacher);
    }

    async deleteTeacher(teacherId: number): Promise<void> {
        const teacher = await this.teacherRepository.findOne({
            where: {id: teacherId},
            relations: ['teacher_media']
        });
        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }
        if (teacher.teacher_media && teacher.teacher_media.length > 0) {
            for (const media of teacher.teacher_media) {
                await this.mediaService.deleteMedia(media.id);
            }
        }
        await this.teacherRepository.remove(teacher);
    }

    async associateMediaWithTeacher(teacherId: number, mediaId: number) {
        const mediaExists = await this.mediaRepository.findOne({
            where: {id: mediaId}
        });
        if (!mediaExists) {
            throw new NotFoundException("Media not found");
        }
        await this.mediaRepository.query(
            'INSERT INTO teacher_media (teacher_id, media_id) VALUES ($1, $2)',
            [teacherId, mediaId]
        )
    }

    async getTeacherInfo(teacherId: number): Promise<{ name: string; profilePictureUrl: string; contact_number: string }> {
        const teacher = await this.teacherRepository.findOne({
          where: { id: teacherId },
          relations: ['teacher_media', 'teacher_media.media'],
        });
      
        if (!teacher) {
          throw new NotFoundException('Teacher not found');
        }
      
        // Set default avatar URL
        let profilePictureUrl = 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg';
      
        // If media exists, use the profile picture URL from the media
        if (teacher.teacher_media && teacher.teacher_media.length > 0) {
          profilePictureUrl = teacher.teacher_media[0].media.url;
        }
      
        // Return basic teacher info
        return {
          name: teacher.name,
          profilePictureUrl: profilePictureUrl,
          contact_number: teacher.contact_number,
        };
      }
      

    

}
