import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/common/entities/student.entity';
import { Repository } from 'typeorm';
import { StudentProfileDto } from './dto/student-profile.dto';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        @InjectRepository(SchoolAdmin)
        private schoolAdminRepository: Repository<SchoolAdmin>
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
    async getAllStudentsForSchool(userId: number): Promise<{ id: number; name: string }[]> {
        const schoolId = await this.getSchoolIdForUser(userId);

        const students = await this.studentRepository
            .createQueryBuilder('student')
            .select(['student.id', 'student.name'])
            .where('student.school_id = :schoolId', { schoolId })
            .getMany();

        return students.map((student) => ({
            id: student.id,
            name: student.name,
        }));
    }
    async getStudentProfile(studentId: number): Promise<StudentProfileDto> {
        const student = await this.studentRepository.findOne({
            where: {id: studentId},
            relations: ['school', 'parent', 'class_students', 'class_students.class']
        });
        if (!student) {
            throw new NotFoundException('Student not found');
        }
        const studentProfile: StudentProfileDto = {
            studentName: student.name,
            schoolName: student.school.name,
            gender: student.gender,
            parentName: student.parent.name,
            parentPhoneNumber: student.parent.phone,
            classes: student.class_students.map((classStudent) => ({
                className: classStudent.class.name
            }))
        };
        return studentProfile;

    }    
}
