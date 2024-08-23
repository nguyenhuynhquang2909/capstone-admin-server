import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Teacher } from 'src/common/entities/teacher.entity';
import { Repository } from 'typeorm';
import { TeacherProfileDto } from './dto/teacher-profile.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { create } from 'domain';
import { Media } from 'src/common/entities/media.entity';

@Injectable()
export class TeacherService {
    private readonly defaultProfilePictureUrl = 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg';
    constructor(
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
        @InjectRepository(SchoolAdmin)
        private readonly schoolAdminRepository: Repository<SchoolAdmin>,
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>
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
            relations: ['school', 'classes', 'teacher_media', 'teacher_media.media']
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
            class_room: classEntity.class_room,
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

}
