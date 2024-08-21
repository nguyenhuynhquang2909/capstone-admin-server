import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/common/entities/student.entity';
import { Repository } from 'typeorm';
import { StudentProfileDto } from './dto/student-profile.dto';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Gender } from 'src/common/enums/gender.enum';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { User } from 'src/common/entities/user.entity';
import { Media } from 'src/common/entities/media.entity';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        @InjectRepository(SchoolAdmin)
        private schoolAdminRepository: Repository<SchoolAdmin>,
        @InjectRepository(User) 
        private userRepository: Repository<User>,
        @InjectRepository(Media)
        private mediaRepository: Repository<Media>
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
            relations: ['school', 'parent', 'class_students', 'class_students.class', 'student_media', ]
        });
        if (!student) {
            throw new NotFoundException('Student not found');
        }
        let avatarUrl = '';
        if (student.student_media.length > 0) {
            avatarUrl = student.student_media[0].media.url;
        } else {
            avatarUrl = 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg';
        }
        const studentProfile: StudentProfileDto = {
            studentName: student.name,
            schoolName: student.school.name,
            gender: student.gender as Gender,
            dateOfBirth: student.date_of_birth,
            parentName: student.parent.name,
            parentPhoneNumber: student.parent.phone,
            avatarUrl: avatarUrl,
            classes: student.class_students.map((classStudent) => ({
                className: classStudent.class.name
            }))
        };
        return studentProfile;

    }    
    async enrollNewStudent(enrollStudentDto: EnrollStudentDto, userId: number): Promise<Student> 
    {
        const {studentName, dateOfBirth, gender,parentName, parentPhone} = enrollStudentDto;
        const schoolId = await this.getSchoolIdForUser(userId);
        let parent = await this.userRepository.findOne({where: {phone: parentPhone}});
        if (!parent) {
            parent = await this.userRepository.create({
                name: parentName, 
                phone: parentPhone,
                role_id: 1,
                is_active: true
            });

        } else {
            parent.role_id = 1;
            parent.is_active = true;
        }
        await this.userRepository.save(parent);
        const newStudent = this.studentRepository.create({
            name: studentName,
            date_of_birth: dateOfBirth,
            gender: gender as Gender, 
            school_id: schoolId, 
            parent: parent, 
        });
        return await this.studentRepository.save(newStudent);
        
    }
    async associateMediaWithStudent(studentId: number, mediaId: number) {
        const mediaExists = await this.mediaRepository.findOne({
            where: {id: mediaId}
        });
        if (!mediaExists) {
            throw new NotFoundException("Media not found");
        }
        await this.mediaRepository.query(
            'INSERT INTO student_media (student_id, media_id) VALUES ($1, $2)',
            [studentId, mediaId]
        );
    }
}
