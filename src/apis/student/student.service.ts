import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/common/entities/student.entity';
import { Repository } from 'typeorm';
import { StudentProfileDto } from './dto/student-profile.dto';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>
    ) {}

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
            parentName: student.parent.name,
            parentPhoneNumber: student.parent.phone,
            classes: student.class_students.map((classStudent) => ({
                className: classStudent.class.name
            }))
        };
        return studentProfile;

    }    
}
