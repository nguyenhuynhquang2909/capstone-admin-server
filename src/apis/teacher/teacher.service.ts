import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Teacher } from 'src/common/entities/teacher.entity';
import { Repository } from 'typeorm';
import { TeacherProfileDto } from './dto/teacher-profile.dto';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
        @InjectRepository(SchoolAdmin)
        private readonly schoolAdminRepository: Repository<SchoolAdmin>
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
            relations: ['school', 'classes']
        })

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
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
        };
        
        return teacherProfile;
    }
}
